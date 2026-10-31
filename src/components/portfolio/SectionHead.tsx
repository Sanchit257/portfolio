export function SectionHead({
  num,
  code,
  plain,
  align = "left",
  tone = "dark",
}: {
  num: string;
  code: string;
  plain: string;
  align?: "left" | "right";
  tone?: "dark" | "light";
}) {
  return (
    <header className="shead" data-fx data-align={align} data-tone={tone}>
      <p className="shead-kicker">
        <span>{num}</span>
        <i aria-hidden />
        {plain}
      </p>
      <h2 className="shead-title" data-text={code}>
        {code}
      </h2>
    </header>
  );
}
