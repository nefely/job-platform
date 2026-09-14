"use client";

import type { MouseEvent, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

interface HashScrollLinkProps {
  href: `/#${string}`;
  className?: string;
  children: ReactNode;
}

// Проблема: клік по /#about, коли URL уже містить #about, нічого не робить
// — ні Link, ні браузер не скролять повторно, бо сам URL не змінюється
// (немає navigation/hashchange, за яким могла б спрацювати прокрутка).
// Якщо цільовий елемент уже є в DOM (тобто ми вже на сторінці з цим
// якорем) — скролимо вручну щоразу, незалежно від того, чи хеш уже
// збігається. Якщо елемента немає (ми на іншій сторінці) — не чіпаємо
// клік: звичайна навігація Link сама перенесе на потрібну сторінку й
// проскролить після монтування (це вже працює коректно).
export function HashScrollLink({ href, className, children }: HashScrollLinkProps) {
  const id = href.slice(2);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const el = document.getElementById(id);
    if (!el) return;

    event.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== `#${id}`) {
      history.pushState(null, "", `#${id}`);
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
