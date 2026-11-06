"""Builds and renders the portfolio's cinematic intro in headless Blender.

Run it through intro/build.py, which reads the Blender path from
intro/config.local.json. Directly:

    blender -b --factory-startup -P intro/blender/build_scene.py -- \
        --out intro/build/frames [--scale 100] [--samples 24] \
        [--frames 10,60,120] [--blend intro/build/intro.blend]

Everything here is generated from primitives. The scene uses no imported
models, textures or HDRIs. Storyboard: docs/intro-storyboard.md.

Timeline (24 fps, 192 frames = 8.0 s of video):
    1-29    street fades up, lightning      (beat 1, HUD power-on)
    30-91   dolly down the street           (beat 2)
    92-130  arrive at the flank, door opens (beat 3)
    131-173 low wide, rotor spins up        (beat 4)
    174-192 rotor wash push-in              (beat 5, flash is done in HTML)
"""

import argparse
import math
import os
import random
import sys

import bmesh
import bpy
from mathutils import Vector

FPS = 24
FRAMES = 192
CUT = 131  # first frame of the rotor shot

TRACER = (1.0, 0.144, 0.0065)  # --tracer #ff6a13 in linear RGB
SODIUM = (1.0, 0.45, 0.12)
RED = (1.0, 0.02, 0.01)

rng = random.Random(7)


# ---------------------------------------------------------------- helpers

def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def smooth(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def ramp(f, a, b):
    """0 before frame a, 1 after frame b, linear between."""
    return clamp((f - a) / (b - a))


def catmull(points, u):
    """Sample a Catmull-Rom spline through points at u in [0, 1]."""
    n = len(points) - 1
    u = clamp(u) * n
    i = min(int(u), n - 1)
    t = u - i
    p0 = points[max(i - 1, 0)]
    p1 = points[i]
    p2 = points[i + 1]
    p3 = points[min(i + 2, n)]
    t2, t3 = t * t, t * t * t
    return 0.5 * (
        (2 * p1)
        + (-p0 + p2) * t
        + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
        + (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    )


def link(obj, parent=None):
    bpy.context.scene.collection.objects.link(obj)
    if parent:
        obj.parent = parent
    return obj


def mesh_obj(name, bm, material, parent=None, smooth_shade=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    if smooth_shade:
        for p in me.polygons:
            p.use_smooth = True
    me.materials.append(material)
    return link(bpy.data.objects.new(name, me), parent)


def box(name, loc, size, material, parent=None, bevel=0.0, rot=(0, 0, 0)):
    """A box with real dimensions in metres (no object scale)."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    obj = mesh_obj(name, bm, material, parent, smooth_shade=bevel > 0)
    obj.location = loc
    obj.rotation_euler = [math.radians(a) for a in rot]
    if bevel:
        mod = obj.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 4
        mod.limit_method = "NONE"
    return obj


def blade(name, x0, x1, width, thick, material, parent):
    """A rotor blade whose origin is at the hub, extending along +X."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((
            x0 + (v.co.x + 0.5) * (x1 - x0),
            v.co.y * width * (1.0 - 0.3 * (v.co.x + 0.5)),
            v.co.z * thick,
        ))
    return mesh_obj(name, bm, material, parent)


def cone(name, loc, r1, r2, depth, material, parent=None, rot=(0, 0, 0), segs=24):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=segs,
                          radius1=r1, radius2=r2, depth=depth)
    obj = mesh_obj(name, bm, material, parent, smooth_shade=True)
    obj.location = loc
    obj.rotation_euler = [math.radians(a) for a in rot]
    return obj


def sphere(name, loc, scale, material, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=32, v_segments=16, radius=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * scale[0], v.co.y * scale[1], v.co.z * scale[2]))
    obj = mesh_obj(name, bm, material, parent, smooth_shade=True)
    obj.location = loc
    return obj


def plane(name, loc, w, h, material, parent=None, rot=(0, 0, 0)):
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    for v in bm.verts:
        v.co = Vector((v.co.x * w, v.co.y * h, 0))
    uv = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for loop in f.loops:
            loop[uv].uv = (loop.vert.co.x / w + 0.5, loop.vert.co.y / h + 0.5)
    obj = mesh_obj(name, bm, material, parent)
    obj.location = loc
    obj.rotation_euler = [math.radians(a) for a in rot]
    return obj


def principled(name, color, rough=0.5, metal=0.0, emit=None, strength=0.0):
    m = bpy.data.materials.new(name)
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    if emit:
        bsdf.inputs["Emission Color"].default_value = (*emit, 1)
        bsdf.inputs["Emission Strength"].default_value = strength
    return m


def emission(name, color, strength):
    m = bpy.data.materials.new(name)
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (*color, 1)
    em.inputs["Strength"].default_value = strength
    nt.links.new(em.outputs[0], out.inputs["Surface"])
    return m, em.inputs["Strength"]


def key(target, path, value, frame):
    setattr(target, path, value)
    target.keyframe_insert(path, frame=frame)


def key_socket(socket, value, frame):
    socket.default_value = value
    socket.keyframe_insert("default_value", frame=frame)


# ---------------------------------------------------------------- scene

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    prefs = bpy.context.preferences.edit
    prefs.keyframe_new_interpolation_type = "LINEAR"


def setup_render(args):
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.fps = FPS
    sc.frame_start, sc.frame_end = 1, FRAMES
    sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
    sc.render.resolution_percentage = args.scale
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.5
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGB"
    sc.render.film_transparent = False

    ee = sc.eevee
    ee.taa_render_samples = args.samples
    ee.use_raytracing = True
    ee.use_shadows = True
    ee.use_volumetric_shadows = True
    ee.volumetric_tile_size = "8"
    ee.volumetric_samples = 48
    ee.volumetric_start = 0.5
    ee.volumetric_end = 90.0
    ee.use_fast_gi = True
    ee.shadow_pool_size = "1024"

    vs = sc.view_settings
    for view in ("AgX", "Filmic"):
        try:
            vs.view_transform = view
            break
        except TypeError:
            pass
    for look in ("AgX - Medium High Contrast", "Medium High Contrast", "AgX - Punchy", "Punchy"):
        try:
            vs.look = look
            break
        except TypeError:
            pass
    vs.exposure = 0.2


def build_world():
    w = bpy.data.worlds.new("Night")
    bpy.context.scene.world = w
    nt = w.node_tree
    bg = nt.nodes["Background"]
    bg.inputs["Color"].default_value = (0.004, 0.006, 0.011, 1)
    bg.inputs["Strength"].default_value = 1.0
    vol = nt.nodes.new("ShaderNodeVolumePrincipled")
    vol.inputs["Color"].default_value = (0.55, 0.6, 0.65, 1)
    vol.inputs["Density"].default_value = 0.022
    vol.inputs["Anisotropy"].default_value = 0.35
    out = nt.nodes["World Output"]
    nt.links.new(vol.outputs[0], out.inputs["Volume"])

    # Lightning: a cold sun that fires for a few frames in beat 1.
    sun_data = bpy.data.lights.new("Lightning", "SUN")
    sun_data.color = (0.65, 0.75, 1.0)
    sun_data.angle = math.radians(8)
    sun = link(bpy.data.objects.new("Lightning", sun_data))
    sun.rotation_euler = (math.radians(35), 0, math.radians(150))
    for f in range(1, FRAMES + 1):
        e = {17: 5.0, 18: 2.0, 20: 3.5, 21: 0.8}.get(f, 0.0)
        key(sun_data, "energy", e, f)
        key_socket(bg.inputs["Strength"], 1.0 + e * 4.0, f)


def build_street():
    asphalt = bpy.data.materials.new("WetAsphalt")
    nt = asphalt.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.018, 0.018, 0.02, 1)
    bsdf.inputs["Specular IOR Level"].default_value = 0.6
    coord = nt.nodes.new("ShaderNodeTexCoord")
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 0.18
    noise.inputs["Detail"].default_value = 4.0
    nt.links.new(coord.outputs["Object"], noise.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.46
    cr.color_ramp.elements[0].color = (0.03, 0.03, 0.03, 1)  # puddles
    cr.color_ramp.elements[1].position = 0.56
    cr.color_ramp.elements[1].color = (0.45, 0.45, 0.45, 1)
    nt.links.new(noise.outputs["Fac"], cr.inputs["Fac"])
    nt.links.new(cr.outputs["Color"], bsdf.inputs["Roughness"])
    grit = nt.nodes.new("ShaderNodeTexNoise")
    grit.inputs["Scale"].default_value = 60.0
    nt.links.new(coord.outputs["Object"], grit.inputs["Vector"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    nt.links.new(grit.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])

    concrete = principled("Concrete", (0.035, 0.035, 0.033), rough=0.85)
    paint = principled("LanePaint", (0.3, 0.27, 0.15), rough=0.85)
    paint.node_tree.nodes["Principled BSDF"].inputs["Specular IOR Level"].default_value = 0.15

    box("Road", (0, 70, -0.05), (60, 220, 0.1), asphalt)
    for side in (-1, 1):
        box(f"Curb{side}", (side * 7.5, 70, 0.07), (3.0, 220, 0.14), concrete)
    for y in range(-30, 170, 6):
        if 46 < y < 78:
            continue
        box(f"Dash{y}", (0, y, 0.004), (0.14, 2.6, 0.01), paint)
    # Cross-street stop lines at the intersection.
    for y in (55.2, 72.8):
        box(f"Stop{y}", (0, y, 0.004), (11.5, 0.4, 0.01), paint)

    build_buildings()
    build_streetlights()
    build_sign()
    build_steam()


def facade_material():
    m = bpy.data.materials.new("Facade")
    nt = m.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.028, 0.028, 0.026, 1)
    bsdf.inputs["Roughness"].default_value = 0.8
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(coord.outputs["Object"], sep.inputs[0])
    info = nt.nodes.new("ShaderNodeObjectInfo")
    comb = nt.nodes.new("ShaderNodeCombineXYZ")
    # Windows on the street-facing (X) faces run along Y and Z.
    add = nt.nodes.new("ShaderNodeMath")
    add.operation = "ADD"
    nt.links.new(sep.outputs["Y"], add.inputs[0])
    nt.links.new(sep.outputs["X"], add.inputs[1])
    nt.links.new(add.outputs[0], comb.inputs["X"])
    nt.links.new(sep.outputs["Z"], comb.inputs["Y"])
    nt.links.new(info.outputs["Random"], comb.inputs["Z"])
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.offset = 0.0
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Brick Width"].default_value = 2.2
    brick.inputs["Row Height"].default_value = 3.0
    brick.inputs["Mortar Size"].default_value = 0.7
    brick.inputs["Mortar Smooth"].default_value = 0.0
    brick.inputs["Bias"].default_value = 0.7
    brick.inputs["Color1"].default_value = (1.0, 0.62, 0.32, 1)
    brick.inputs["Color2"].default_value = (0.0, 0.0, 0.0, 1)
    brick.inputs["Mortar"].default_value = (0.0, 0.0, 0.0, 1)
    nt.links.new(comb.outputs[0], brick.inputs["Vector"])
    nt.links.new(brick.outputs["Color"], bsdf.inputs["Emission Color"])
    bsdf.inputs["Emission Strength"].default_value = 0.8
    return m


def build_buildings():
    facade = facade_material()
    roof = principled("Roof", (0.02, 0.02, 0.02), rough=0.9)
    for side in (-1, 1):
        y = -40.0
        while y < 190:
            width = rng.uniform(9, 16)
            if 54 < y + width / 2 < 74 or 54 < y < 74:
                y = 74.0
                continue
            height = rng.uniform(9, 30)
            depth = rng.uniform(10, 16)
            x = side * (9.0 + depth / 2)
            b = box(f"Bldg{side}_{int(y)}", (x, y + width / 2, height / 2),
                    (depth, width - 0.6, height), facade)
            box(f"Roof{side}_{int(y)}", (x, y + width / 2, height + 0.3),
                (depth + 0.4, width - 0.2, 0.6), roof)
            b.visible_shadow = True
            y += width
    # Distant buildings across the intersection so the cut has a skyline.
    for i in range(10):
        x = rng.uniform(-50, 50)
        if abs(x) < 9:
            continue
        h = rng.uniform(14, 40)
        box(f"Far{i}", (x, rng.choice((90, 100, 45, 40)) + rng.uniform(-5, 5), h / 2),
            (rng.uniform(8, 14), rng.uniform(8, 14), h), facade)


def build_streetlights():
    pole_mat = principled("Pole", (0.04, 0.045, 0.04), rough=0.4, metal=0.8)
    head_mat, _ = emission("LampHead", SODIUM, 25.0)
    for i, y in enumerate(range(18, 130, 14)):
        if 56 < y < 72:
            continue
        side = -1 if i % 2 else 1
        x = side * 6.6
        box(f"Pole{y}", (x, y, 3.25), (0.16, 0.16, 6.5), pole_mat)
        box(f"Arm{y}", (x - side * 0.9, y, 6.45), (1.9, 0.12, 0.12), pole_mat)
        box(f"Head{y}", (x - side * 1.7, y, 6.32), (0.7, 0.32, 0.12), head_mat)
        ld = bpy.data.lights.new(f"Sodium{y}", "SPOT")
        ld.color = SODIUM
        ld.energy = 2600
        ld.spot_size = math.radians(95)
        ld.spot_blend = 0.6
        ld.shadow_soft_size = 0.3
        lo = link(bpy.data.objects.new(f"Sodium{y}", ld))
        lo.location = (x - side * 1.7, y, 6.2)


def build_sign():
    """A flickering orange sign: the only saturated colour in the street."""
    mat, strength = emission("Neon", TRACER, 30.0)
    plane("Neon", (-8.92, 41, 6.5), 0.5, 4.2, mat, rot=(0, 90, 0))
    plane("NeonBar", (-8.92, 41, 5.7), 0.18, 3.0, mat, rot=(0, 90, 0))
    ld = bpy.data.lights.new("NeonSpill", "AREA")
    ld.color = TRACER
    ld.energy = 900
    ld.size = 4.0
    lo = link(bpy.data.objects.new("NeonSpill", ld))
    lo.location = (-8.4, 41, 6.1)
    lo.rotation_euler = (0, math.radians(-90 - 20), 0)
    flicker = {23, 24, 47, 49, 50, 88, 89}
    for f in range(1, FRAMES + 1):
        on = 0.12 if f in flicker else 1.0
        key_socket(strength, 30.0 * on, f)
        key(ld, "energy", 900 * on, f)


def build_steam():
    m = bpy.data.materials.new("Steam")
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    vol = nt.nodes.new("ShaderNodeVolumePrincipled")
    vol.inputs["Color"].default_value = (0.8, 0.8, 0.82, 1)
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.noise_dimensions = "4D"
    noise.inputs["Scale"].default_value = 1.4
    noise.inputs["Detail"].default_value = 3.0
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.5
    cr.color_ramp.elements[1].position = 0.75
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = 0.6
    nt.links.new(noise.outputs["Fac"], cr.inputs["Fac"])
    nt.links.new(cr.outputs["Color"], mul.inputs[0])
    nt.links.new(mul.outputs[0], vol.inputs["Density"])
    nt.links.new(vol.outputs[0], out.inputs["Volume"])
    for f in range(1, FRAMES + 1):
        key_socket(noise.inputs["W"], f * 0.035, f)
    box("Steam", (3.2, 44, 1.6), (2.4, 2.4, 3.2), m)
    grate = principled("Grate", (0.01, 0.01, 0.01), rough=0.3, metal=1.0)
    box("Grate", (3.2, 44, 0.006), (1.2, 0.8, 0.01), grate)


# ---------------------------------------------------------------- helicopter

def build_helicopter():
    hull = principled("Hull", (0.045, 0.05, 0.035), rough=0.42, metal=0.35)
    dark = principled("Trim", (0.012, 0.012, 0.012), rough=0.5, metal=0.6)
    glass = principled("Glass", (0.01, 0.012, 0.015), rough=0.05, metal=0.2)
    blade_mat = principled("Blade", (0.02, 0.02, 0.02), rough=0.35, metal=0.5)

    root = link(bpy.data.objects.new("Helicopter", None))
    root.location = (0, 64, 0)

    box("Cabin", (0.4, 0, 1.45), (4.6, 2.3, 1.9), hull, root, bevel=0.42)
    sphere("Nose", (2.65, 0, 1.3), (1.35, 1.12, 0.92), hull, root)
    sphere("Canopy", (2.75, 0, 1.72), (1.05, 1.0, 0.62), glass, root)
    box("Engine", (-0.1, 0, 2.62), (2.4, 1.45, 0.7), hull, root, bevel=0.25)
    box("Exhaust", (-1.35, 0, 2.62), (0.5, 0.9, 0.45), dark, root, bevel=0.1)
    cone("Boom", (-4.7, 0, 1.95), 0.5, 0.17, 6.4, hull, root, rot=(0, -90, 0))
    box("Fin", (-7.7, 0, 2.6), (1.0, 0.14, 1.6), hull, root, bevel=0.06, rot=(0, -18, 0))
    box("Stab", (-6.9, 0, 1.95), (0.55, 2.2, 0.07), hull, root, bevel=0.02)
    for side in (-1, 1):
        cone(f"Skid{side}", (0.4, side * 1.15, 0.1), 0.06, 0.06, 4.4, dark, root,
             rot=(0, 90, 0), segs=12)
        for x in (-0.6, 1.4):
            box(f"Strut{side}{x}", (x, side * 1.0, 0.38), (0.1, 0.1, 0.6), dark, root,
                rot=(side * 22, 0, 0))
    cone("Mast", (0.35, 0, 3.15), 0.12, 0.12, 0.6, dark, root, segs=12)

    # Door: the interior glow sits behind a sliding panel on the camera side.
    # A boolean cuts a real cavity into the cabin so the doorway has depth.
    cutter = box("DoorCut", (0.3, -0.9, 1.35), (1.45, 0.9, 1.2), dark, root)
    cutter.hide_render = True
    cutter.display_type = "WIRE"
    cabin = bpy.data.objects["Cabin"]
    hole = cabin.modifiers.new("Doorway", "BOOLEAN")
    hole.operation = "DIFFERENCE"
    hole.object = cutter
    glow_mat, glow = emission("CabinGlow", (1.0, 0.12, 0.03), 0.0)
    plane("Interior", (0.3, -0.47, 1.35), 1.45, 1.2, glow_mat, root, rot=(90, 0, 0))
    seat = principled("Seat", (0.006, 0.004, 0.004), rough=0.8)
    box("Bench", (0.3, -0.62, 0.92), (1.45, 0.3, 0.3), seat, root)
    box("Pole", (-0.2, -0.85, 1.35), (0.05, 0.05, 1.2), seat, root)
    box("Strap", (0.45, -0.95, 1.82), (0.04, 0.02, 0.28), seat, root)
    inner = bpy.data.lights.new("CabinInner", "POINT")
    inner.color = (1.0, 0.25, 0.08)
    inner.shadow_soft_size = 0.2
    io = link(bpy.data.objects.new("CabinInner", inner), root)
    io.location = (0.3, -0.8, 1.8)
    for f in range(1, FRAMES + 1):
        key(inner, "energy", 60.0 * smooth(ramp(f, 96, 112)), f)
    door = box("Door", (0.3, -1.205, 1.35), (1.55, 0.05, 1.28), hull, root, bevel=0.03)
    rail = box("DoorRail", (-0.4, -1.2, 2.04), (3.2, 0.06, 0.05), dark, root)
    rail.visible_shadow = False
    spill = bpy.data.lights.new("CabinSpill", "AREA")
    spill.color = (1.0, 0.3, 0.1)
    spill.size = 1.4
    spill.specular_factor = 0.0  # its panel would mirror as a white card in puddles
    so = link(bpy.data.objects.new("CabinSpill", spill), root)
    so.location = (0.3, -1.45, 1.4)
    so.rotation_euler = (math.radians(-68), 0, 0)
    for f in range(1, FRAMES + 1):
        t = smooth(ramp(f, 96, 124))
        key(door, "location", Vector((0.3 - 1.75 * t, -1.205 - 0.04 * min(1, t * 6), 1.35)), f)
        key_socket(glow, 1.1 * smooth(ramp(f, 96, 112)), f)
        key(spill, "energy", 140.0 * smooth(ramp(f, 96, 116)), f)

    # Beacons blink twice a second.
    bea_mat, bea = emission("Beacon", RED, 0.0)
    sphere("BeaconTail", (-7.75, 0, 3.45), (0.07, 0.07, 0.07), bea_mat, root)
    sphere("BeaconBelly", (0.4, 0, 0.42), (0.08, 0.08, 0.05), bea_mat, root)
    bl = bpy.data.lights.new("BeaconLight", "POINT")
    bl.color = RED
    bl.shadow_soft_size = 0.05
    blo = link(bpy.data.objects.new("BeaconLight", bl), root)
    blo.location = (0.4, 0, 0.3)
    for f in range(1, FRAMES + 1):
        on = 1.0 if f % 12 < 2 else 0.0
        key_socket(bea, 60.0 * on, f)
        key(bl, "energy", 40.0 * on, f)

    # Main rotor: four blades on an empty, spun with per-frame keys.
    rotor = link(bpy.data.objects.new("Rotor", None), root)
    rotor.location = (0.35, 0, 3.5)
    box("Hub", (0, 0, 0), (0.5, 0.5, 0.16), dark, rotor, bevel=0.05)
    for i in range(4):
        b = blade(f"Blade{i}", 0.2, 5.9, 0.34, 0.05, blade_mat, rotor)
        b.rotation_euler = (math.radians(2), 0, math.radians(90 * i))

    disc_mat = bpy.data.materials.new("RotorDisc")
    disc_mat.surface_render_method = "BLENDED"
    nt = disc_mat.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    mix = nt.nodes.new("ShaderNodeMixShader")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    dif = nt.nodes.new("ShaderNodeBsdfPrincipled")
    dif.inputs["Base Color"].default_value = (0.03, 0.03, 0.03, 1)
    dif.inputs["Roughness"].default_value = 0.3
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(dif.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    disc = cone("Disc", (0.35, 0, 3.52), 6.0, 6.0, 0.02, disc_mat, root, segs=64)
    disc.visible_shadow = False

    tail = link(bpy.data.objects.new("TailRotor", None), root)
    tail.location = (-7.8, -0.16, 2.95)
    for i in range(2):
        b = blade(f"TailBlade{i}", 0.05, 0.85, 0.12, 0.03, blade_mat, tail)
        b.rotation_euler = (math.radians(90), math.radians(180 * i), 0)

    # Speed in degrees per frame: windmilling, then spin-up after the cut.
    # 4 blades repeat every 90 degrees, so stay under 45/frame to avoid the
    # wagon-wheel effect reading as the rotor running backwards.
    angle = 0.0
    for f in range(1, FRAMES + 1):
        speed = 2.5 + 37.5 * ramp(f, CUT - 4, 176) ** 1.6
        angle += speed
        key(rotor, "rotation_euler", (0, 0, math.radians(angle)), f)
        key(tail, "rotation_euler", (0, math.radians(angle * 3.3), 0), f)
        key_socket(mix.inputs["Fac"], 0.2 * smooth(ramp(speed, 14, 40)), f)
    return root


def build_backlight():
    """Cold light behind the helicopter so it reads as a silhouette in the fog."""
    ld = bpy.data.lights.new("Backlight", "AREA")
    ld.color = (0.45, 0.6, 1.0)
    ld.energy = 5500
    ld.size = 10
    ld.specular_factor = 0.0  # no hard-edged reflection of the panel in puddles
    lo = link(bpy.data.objects.new("Backlight", ld))
    lo.location = (0, 82, 16)
    lo.rotation_euler = (math.radians(-125), 0, 0)
    sd = bpy.data.lights.new("Searchlight", "SPOT")
    sd.color = (0.7, 0.8, 1.0)
    sd.energy = 30000
    sd.spot_size = math.radians(9)
    sd.spot_blend = 0.3
    so = link(bpy.data.objects.new("Searchlight", sd))
    so.location = (-30, 95, 45)
    for f in range(1, FRAMES + 1):
        a = math.radians(-40 + 0.35 * f)
        aim = Vector((12 * math.sin(a), 70 + 10 * math.cos(a), 0)) - so.location
        key(so, "rotation_euler", aim.to_track_quat("-Z", "Y").to_euler(), f)


def build_flares():
    """Two road flares by the helicopter, in the site's tracer orange."""
    mat, strength = emission("Flare", TRACER, 40.0)
    for i, (x, y) in enumerate(((-2.4, 58.4), (3.1, 59.6))):
        sphere(f"Flare{i}", (x, y, 0.06), (0.05, 0.05, 0.05), mat)
        ld = bpy.data.lights.new(f"FlareLight{i}", "POINT")
        ld.color = TRACER
        ld.shadow_soft_size = 0.05
        lo = link(bpy.data.objects.new(f"FlareLight{i}", ld))
        lo.location = (x, y, 0.25)
        for f in range(1, FRAMES + 1):
            flick = 0.75 + 0.25 * math.sin(f * 1.9 + i * 2) * math.sin(f * 0.7 + i)
            key(ld, "energy", 60 * flick, f)
    _ = strength


# ---------------------------------------------------------------- rain

def rain_material(name, speed, drift):
    m = bpy.data.materials.new(name)
    m.surface_render_method = "BLENDED"
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapping = nt.nodes.new("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (520, 2.2, 1)
    mapping.inputs["Rotation"].default_value = (0, 0, math.radians(4))
    nt.links.new(coord.outputs["UV"], mapping.inputs["Vector"])
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 1.0
    noise.inputs["Detail"].default_value = 0.0
    nt.links.new(mapping.outputs[0], noise.inputs["Vector"])
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.74
    cr.color_ramp.elements[0].color = (0, 0, 0, 1)
    cr.color_ramp.elements[1].position = 0.86
    cr.color_ramp.elements[1].color = (0.22, 0.22, 0.22, 1)
    nt.links.new(noise.outputs["Fac"], cr.inputs["Fac"])
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (0.75, 0.8, 0.9, 1)
    em.inputs["Strength"].default_value = 0.7
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(cr.outputs["Color"], mix.inputs["Fac"])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(em.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    loc = mapping.inputs["Location"]
    x = y = 0.0
    for f in range(1, FRAMES + 1):
        wash = ramp(f, CUT + 10, FRAMES)
        y += speed
        x += drift * wash
        key_socket(loc, (x, y, f * 0.01), f)
        key_socket(mapping.inputs["Rotation"], (0, 0, math.radians(4 + 26 * wash)), f)
    return m


def add_rain(cam, lens):
    half = 18.0 / lens  # half sensor width (36mm) over focal length
    for i, (d, speed) in enumerate(((1.6, 0.9), (4.0, 0.6), (9.0, 0.4))):
        mat = rain_material(f"Rain{cam.name}{i}", speed, 0.35 / (i + 1))
        p = plane(f"Rain{cam.name}{i}", (0, 0, -d), half * d * 2.4, half * d * 1.5,
                  mat, cam)
        p.visible_shadow = False


# ---------------------------------------------------------------- cameras

def make_camera(name, lens):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.clip_start = 0.05
    cd.clip_end = 400
    cam = link(bpy.data.objects.new(name, cd))
    target = link(bpy.data.objects.new(name + "Target", None))
    con = cam.constraints.new("TRACK_TO")
    con.target = target
    con.track_axis = "TRACK_NEGATIVE_Z"
    con.up_axis = "UP_Y"
    return cam, target


def animate_dolly(cam, target):
    path = [Vector(p) for p in (
        (0.5, 27.0, 1.75), (0.1, 37.0, 1.7), (-0.3, 45.0, 1.62),
        (0.0, 52.0, 1.55), (0.25, 56.2, 1.5),
    )]
    heli = Vector((0.5, 64.0, 1.7))
    door = Vector((0.1, 62.8, 1.55))
    for f in range(1, CUT):
        u = (f - 1) / (CUT - 2)
        s = 1 - (1 - u) ** 2.3
        pos = catmull(path, s)
        settle = 1 - smooth(ramp(f, 70, 110))
        pos.z += 0.028 * math.sin(2 * math.pi * f / 12) * settle
        pos.x += 0.012 * math.sin(2 * math.pi * f / 24) * settle
        key(cam, "location", pos, f)
        key(target, "location", heli.lerp(door, smooth(ramp(f, 72, 118))), f)


def animate_wide(cam, target):
    for f in range(CUT, FRAMES + 1):
        a = ramp(f, CUT, 174)
        b = smooth(ramp(f, 174, FRAMES))
        pos = Vector((-4.2, 53.6, 0.3)).lerp(Vector((-3.6, 55.0, 0.36)), a)
        pos = pos.lerp(Vector((-2.4, 57.4, 0.7)), b)
        aim = Vector((0.6, 64.0, 2.9)).lerp(Vector((0.35, 64.0, 3.6)), b)
        amp = 0.006 + 0.05 * ramp(f, CUT, FRAMES) ** 2
        shake = Vector((
            math.sin(f * 1.7) + 0.5 * math.sin(f * 3.9),
            math.sin(f * 2.3 + 1) + 0.5 * math.sin(f * 4.7),
            math.sin(f * 2.9 + 2) + 0.5 * math.sin(f * 5.3),
        )) * amp
        key(cam, "location", pos + shake * 0.6, f)
        key(target, "location", aim + shake * 2.0, f)


def build_cameras():
    sc = bpy.context.scene
    cam1, t1 = make_camera("CamDolly", 28)
    cam2, t2 = make_camera("CamWide", 18)
    animate_dolly(cam1, t1)
    animate_wide(cam2, t2)
    add_rain(cam1, 28)
    add_rain(cam2, 18)
    sc.camera = cam1
    m1 = sc.timeline_markers.new("dolly", frame=1)
    m1.camera = cam1
    m2 = sc.timeline_markers.new("wide", frame=CUT)
    m2.camera = cam2


# ---------------------------------------------------------------- main

def parse():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--scale", type=int, default=100)
    p.add_argument("--samples", type=int, default=24)
    p.add_argument("--frames", default="", help="comma list for stills; empty = full")
    p.add_argument("--blend", default="")
    return p.parse_args(argv)


def main():
    args = parse()
    reset()
    setup_render(args)
    build_world()
    build_street()
    build_helicopter()
    build_flares()
    build_backlight()
    build_cameras()

    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)
    if args.blend:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(args.blend))

    sc = bpy.context.scene
    if args.frames:
        for f in [int(x) for x in args.frames.split(",")]:
            sc.frame_set(f)
            sc.render.filepath = os.path.join(out, f"{f:04d}.png")
            bpy.ops.render.render(write_still=True)
    else:
        sc.render.filepath = os.path.join(out, "")
        bpy.ops.render.render(animation=True)


main()
