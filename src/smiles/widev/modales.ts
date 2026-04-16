type WiModalOpts = {
  focus?: boolean;
};

const MODAL_SELECTOR = ".wiModal";
const MODAL_ACTIVE_CLASS = "active";
const BODY_OPEN_CLASS = "modal-open";
const STYLE_ID = "wiModalCss";

const WI_MODAL_CSS = `
.wiModal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:10000;justify-content:center;align-items:center;backdrop-filter:saturate(120%) blur(2px)}
.wiModal.active{display:flex}
body.modal-open{overflow:hidden}
.modalBody{position:relative;border-radius:1rem;box-shadow:0 18px 44px rgba(0,0,0,.18);width:min(92vw,560px);max-height:90vh;overflow:auto;z-index:10001}
.modalX{z-index:10002;background:transparent;border:0;color:var(--mco);font-size:1.4rem;cursor:pointer;transition:transform .15s,opacity .15s;text-shadow:0 1px 2px rgba(0,0,0,.15);position:absolute;top:12px;right:12px}
.modalX:hover{transform:scale(1.08);opacity:.95}
`;

function toModalId(id: string) {
  return id.startsWith("#") ? id.slice(1) : id;
}

function getModal(id: string) {
  if (typeof document === "undefined") return null;
  return document.getElementById(toModalId(id));
}

function syncBodyScroll() {
  if (typeof document === "undefined") return;
  const hasOpen = Boolean(
    document.querySelector(`${MODAL_SELECTOR}.${MODAL_ACTIVE_CLASS}`)
  );
  document.body.classList.toggle(BODY_OPEN_CLASS, hasOpen);
}

export function inyectarCssModales() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = WI_MODAL_CSS;
  document.head.appendChild(style);
}

export function abrirModal(id: string, opts: WiModalOpts = {}) {
  const modal = getModal(id);
  if (!modal) {
    console.warn(`Modal #${toModalId(id)} no existe`);
    return false;
  }
  inyectarCssModales();
  modal.classList.add(MODAL_ACTIVE_CLASS);
  syncBodyScroll();

  if (opts.focus !== false) {
    window.setTimeout(() => {
      const firstField = modal.querySelector<HTMLElement>(
        "input,select,textarea,button"
      );
      firstField?.focus();
    }, 20);
  }
  return true;
}

export function cerrarModal(id: string) {
  const modal = getModal(id);
  if (!modal) return false;
  modal.classList.remove(MODAL_ACTIVE_CLASS);
  syncBodyScroll();
  return true;
}

export function cerrarTodos() {
  if (typeof document === "undefined") return;
  document
    .querySelectorAll<HTMLElement>(MODAL_SELECTOR)
    .forEach((node) => node.classList.remove(MODAL_ACTIVE_CLASS));
  syncBodyScroll();
}

function onClickModal(ev: MouseEvent) {
  const target = ev.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.closest(".modalX")) {
    cerrarTodos();
    return;
  }

  if (target.matches(MODAL_SELECTOR)) {
    target.classList.remove(MODAL_ACTIVE_CLASS);
    syncBodyScroll();
  }
}

function onEscapeModal(ev: KeyboardEvent) {
  if (ev.key !== "Escape") return;
  if (!document.querySelector(`${MODAL_SELECTOR}.${MODAL_ACTIVE_CLASS}`)) return;
  cerrarTodos();
}

let listenersOn = false;

export function iniciarModales() {
  if (typeof document === "undefined" || listenersOn) return;
  inyectarCssModales();
  document.addEventListener("click", onClickModal);
  document.addEventListener("keydown", onEscapeModal);
  listenersOn = true;
}
