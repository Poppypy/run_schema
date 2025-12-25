(function () {
  "use strict";

  const STORAGE_KEY = "run_schema:v1";
  const MAX_ITEMS = 80;
  const LANG_KEY = "run_schema:lang";

  const EXAMPLE_URL = "himovie://com.huawei.himovie/showcampaign?campaignid=himovie.jilixgsp";
  const EXAMPLE_NOTE_ZH = "\u534E\u4E3A\u89C6\u9891\u8DF3\u8F6C"; // Huawei Video jump

  const el = {
    subtitle: document.getElementById("subtitle"),
    quickExample: document.getElementById("quickExample"),
    btnLang: document.getElementById("btnLang"),
    avatarWrap: document.getElementById("avatarWrap"),
    avatarImg: document.getElementById("avatarImg"),
    byRole: document.getElementById("byRole"),
    quickTitle: document.getElementById("quickTitle"),
    quickHint: document.getElementById("quickHint"),
    labelSchema1: document.getElementById("labelSchema1"),
    labelNote1: document.getElementById("labelNote1"),
    labelNote1Hint: document.getElementById("labelNote1Hint"),
    btnTextRun1: document.getElementById("btnTextRun1"),
    btnTextSave1: document.getElementById("btnTextSave1"),
    libraryTitle: document.getElementById("libraryTitle"),
    libraryHint: document.getElementById("libraryHint"),
    btnTextImport: document.getElementById("btnTextImport"),
    btnTextExport: document.getElementById("btnTextExport"),
    btnTextClear: document.getElementById("btnTextClear"),
    emptyText: document.getElementById("emptyText"),
    addTitle: document.getElementById("addTitle"),
    addHint: document.getElementById("addHint"),
    labelSchema2: document.getElementById("labelSchema2"),
    labelSchema2Hint: document.getElementById("labelSchema2Hint"),
    labelNote2: document.getElementById("labelNote2"),
    labelNote2Hint: document.getElementById("labelNote2Hint"),
    btnTextAdd: document.getElementById("btnTextAdd"),
    btnTextPaste: document.getElementById("btnTextPaste"),
    list: document.getElementById("list"),
    empty: document.getElementById("empty"),
    toast: document.getElementById("toast"),
    quickUrl: document.getElementById("quickUrl"),
    quickNote: document.getElementById("quickNote"),
    newUrl: document.getElementById("newUrl"),
    newNote: document.getElementById("newNote"),
    btnQuickRun: document.getElementById("btnQuickRun"),
    btnQuickSave: document.getElementById("btnQuickSave"),
    btnAdd: document.getElementById("btnAdd"),
    btnPaste: document.getElementById("btnPaste"),
    btnClearAll: document.getElementById("btnClearAll"),
    btnExport: document.getElementById("btnExport"),
    btnImport: document.getElementById("btnImport"),
  };

  let toastTimer = 0;
  let currentLang = "en";

  const STR = {
    en: {
      subtitle:
        "Save deep links (schema) with notes in local cache (LocalStorage). Tap Run to try opening apps on iOS / Android / HarmonyOS.",
      subtitleTiny: "(Local-only. You can delete anytime.)",
      byRole: "Personal toolkit",
      quickTitle: "Run instantly",
      quickHint: "Paste a schema link and run. Press Enter to run.",
      labelSchema: "Schema Link",
      labelNote: "Note",
      labelNoteHint: "",
      btnRun: "Run",
      btnSave: "Save",
      libraryTitle: "Saved links",
      libraryHint: "Data stays in your browser LocalStorage. Delete means local delete only.",
      btnImport: "Import",
      btnExport: "Export",
      btnClear: "Clear",
      emptyText: "No saved links yet. Use Quick Run -> Save, or Add New below.",
      addTitle: "Add and save",
      addHint:
        "Tip: browsers may block custom schemes. If Run does nothing, make sure the target app is installed and open this page in a system browser.",
      required: "Required",
      note: "Note",
      noteHint: "Meaning / device / business",
      btnAdd: "Add to list",
      btnPaste: "Paste",
      toastEnterLink: "Please enter a schema link.",
      toastBadLink: "This does not look like a schema URL.",
      toastBadLinkTiny: "Example: yourapp://... or mailto:xxx@xx.com",
      toastSaved: "Saved to local cache.",
      toastAttempted: "Attempted to open.",
      toastAttemptedTiny: "If nothing happens, your browser may block custom schemes.",
      toastClipboardEmpty: "Clipboard is empty.",
      toastPasted: "Pasted.",
      toastClipboardNoRead: "Cannot read clipboard.",
      toastClipboardNoReadTiny: "Some browsers require permission.",
      toastAlreadyEmpty: "Already empty.",
      confirmClear: "Clear all local cache? This cannot be undone.",
      toastCleared: "Cleared.",
      toastExportOk: "Exported to clipboard (JSON).",
      toastExportFail: "Export failed.",
      toastImportEmptyTiny: "Copy JSON first, then import.",
      toastImportOk: "Import success.",
      toastImportFail: "Import failed.",
      toastImportFailTiny: "Clipboard is not valid JSON.",
      toastCopied: "Copied.",
      toastCopyFail: "Copy failed.",
      confirmDeletePrefix: "Delete",
      toastDeleted: "Deleted.",
      itemUntitled: "Untitled",
      itemCopy: "Copy",
      itemDelete: "Delete",
    },
    zh: {
      subtitle:
        "\u4FDD\u5B58\u5E76\u8FD0\u884C deep link/schema\uff0c\u5907\u6CE8\u4FDD\u5B58\u5230\u672C\u673A\u7F13\u5B58\uff08LocalStorage\uff09\uff0c\u4E00\u952E Run \u5C1D\u8BD5\u5524\u8D77 iOS / Android / \u9E3F\u8499 App\u3002",
      subtitleTiny: "\uFF08\u6570\u636E\u4EC5\u4FDD\u5B58\u5728\u672C\u673A\uff0C\u53EF\u968F\u65F6\u5220\u9664\uFF09",
      byRole: "\u4E2A\u4EBA\u5DE5\u5177",
      quickTitle: "\u76F4\u63A5\u8DF3\u8F6C",
      quickHint: "\u7C98\u8D34 schema \u94FE\u63A5\u540E\u76F4\u63A5 Run\uff0C\u56DE\u8F66\u4E5F\u53EF\u4EE5\u3002",
      labelSchema: "Schema \u94FE\u63A5",
      labelNote: "\u5907\u6CE8",
      labelNoteHint: "",
      btnRun: "Run",
      btnSave: "\u6536\u85CF",
      libraryTitle: "\u5DF2\u4FDD\u5B58",
      libraryHint: "\u6570\u636E\u4EC5\u4FDD\u5B58\u4E8E\u6D4F\u89C8\u5668 LocalStorage\uff0C\u5220\u9664\u5373\u672C\u5730\u5220\u9664\u3002",
      btnImport: "\u5BFC\u5165",
      btnExport: "\u5BFC\u51FA",
      btnClear: "\u6E05\u7A7A",
      emptyText:
        "\u8FD8\u6CA1\u6709\u94FE\u63A5\u3002\u53EF\u4EE5\u7528\u201C\u76F4\u63A5\u8DF3\u8F6C\u201D\u91CC\u7684\u201C\u6536\u85CF\u201D\uFF0C\u6216\u4E0B\u65B9\u201C\u6DFB\u52A0\u5E76\u4FDD\u5B58\u201D\u3002",
      addTitle: "\u6DFB\u52A0\u5E76\u4FDD\u5B58",
      addHint:
        "\u63D0\u793A\uff1A\u90E8\u5206\u6D4F\u89C8\u5668\u4F1A\u62E6\u622A\u81EA\u5B9A\u4E49 scheme\u3002\u5982\u679C Run \u65E0\u53CD\u5E94\uff0C\u8BF7\u786E\u8BA4\u5DF2\u5B89\u88C5 App\uff0C\u5E76\u7528\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6253\u5F00\u672C\u9875\u3002",
      required: "\u5FC5\u586B",
      note: "\u5907\u6CE8",
      noteHint: "\u5EFA\u8BAE\uff1A\u8BBE\u5907/\u4E1A\u52A1\u542B\u4E49",
      btnAdd: "\u6DFB\u52A0\u5230\u5217\u8868",
      btnPaste: "\u7C98\u8D34",
      toastEnterLink: "\u8BF7\u5148\u586B\u5199 schema \u94FE\u63A5\u3002",
      toastBadLink: "\u94FE\u63A5\u770B\u8D77\u6765\u4E0D\u50CF schema\u3002",
      toastBadLinkTiny: "\u793A\u4F8B\uff1Ayourapp://... \u6216 mailto:xxx@xx.com",
      toastSaved: "\u5DF2\u4FDD\u5B58\u5230\u672C\u673A\u7F13\u5B58\u3002",
      toastAttempted: "\u5DF2\u5C1D\u8BD5\u6253\u5F00\u3002",
      toastAttemptedTiny: "\u5982\u679C\u672A\u8DF3\u8F6C\uff0C\u53EF\u80FD\u662F\u6D4F\u89C8\u5668\u62E6\u622A\u6216\u672A\u5B89\u88C5 App\u3002",
      toastClipboardEmpty: "\u526A\u8D34\u677F\u4E3A\u7A7A\u3002",
      toastPasted: "\u5DF2\u7C98\u8D34\u3002",
      toastClipboardNoRead: "\u65E0\u6CD5\u8BFB\u53D6\u526A\u8D34\u677F\u3002",
      toastClipboardNoReadTiny: "\u53EF\u80FD\u9700\u8981\u526A\u8D34\u677F\u6743\u9650\u3002",
      toastAlreadyEmpty: "\u5DF2\u662F\u7A7A\u5217\u8868\u3002",
      confirmClear: "\u786E\u5B9A\u6E05\u7A7A\u6240\u6709\u672C\u5730\u7F13\u5B58\uff1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002",
      toastCleared: "\u5DF2\u6E05\u7A7A\u3002",
      toastExportOk: "\u5DF2\u5BFC\u51FA\u5230\u526A\u8D34\u677F\uff08JSON\uff09\u3002",
      toastExportFail: "\u5BFC\u51FA\u5931\u8D25\u3002",
      toastImportEmptyTiny: "\u5148\u590D\u5236\u4E00\u6BB5 JSON \u518D\u5BFC\u5165\u3002",
      toastImportOk: "\u5BFC\u5165\u6210\u529F\u3002",
      toastImportFail: "\u5BFC\u5165\u5931\u8D25\u3002",
      toastImportFailTiny: "\u526A\u8D34\u677F\u5185\u5BB9\u4E0D\u662F\u6709\u6548 JSON\u3002",
      toastCopied: "\u5DF2\u590D\u5236\u3002",
      toastCopyFail: "\u590D\u5236\u5931\u8D25\u3002",
      confirmDeletePrefix: "\u5220\u9664",
      toastDeleted: "\u5DF2\u5220\u9664\u3002",
      itemUntitled: "\u672A\u547D\u540D",
      itemCopy: "\u590D\u5236",
      itemDelete: "\u5220\u9664",
    },
  };

  function detectLang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "en" || stored === "zh") return stored;
    return (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function t(key) {
    return STR[currentLang]?.[key] ?? STR.en[key] ?? key;
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    el.subtitle.textContent = `${t("subtitle")} ${t("subtitleTiny")}`;
    el.byRole.textContent = t("byRole");
    el.quickTitle.textContent = t("quickTitle");
    el.quickHint.textContent = t("quickHint");
    el.labelSchema1.textContent = t("labelSchema");
    el.labelNote1.textContent = t("labelNote");
    el.labelNote1Hint.textContent = t("labelNoteHint");
    el.btnTextRun1.textContent = t("btnRun");
    el.btnTextSave1.textContent = t("btnSave");
    el.libraryTitle.textContent = t("libraryTitle");
    el.libraryHint.textContent = t("libraryHint");
    el.btnTextImport.textContent = t("btnImport");
    el.btnTextExport.textContent = t("btnExport");
    el.btnTextClear.textContent = t("btnClear");
    el.emptyText.textContent = t("emptyText");
    el.addTitle.textContent = t("addTitle");
    el.addHint.textContent = t("addHint");
    el.labelSchema2.textContent = t("labelSchema");
    el.labelSchema2Hint.textContent = t("required");
    el.labelNote2.textContent = t("note");
    el.labelNote2Hint.textContent = t("noteHint");
    el.btnTextAdd.textContent = t("btnAdd");
    el.btnTextPaste.textContent = t("btnPaste");

    el.btnLang.textContent = lang === "zh" ? "EN" : "\u4E2D\u6587";
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeUrl(raw) {
    return String(raw || "").trim();
  }

  function normalizeNote(raw) {
    return String(raw || "").trim();
  }

  function isLikelySchemaUrl(url) {
    // Accept `scheme://...` and also `scheme:...` (mailto:, intent:, etc)
    return /^[a-zA-Z][a-zA-Z0-9+.-]*:(\/\/)?\S+/.test(url);
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function showToast(message, tiny) {
    window.clearTimeout(toastTimer);
    const safeMessage = escapeHtml(message);
    const safeTiny = tiny ? `<span class="tiny">${escapeHtml(tiny)}</span>` : "";
    el.toast.innerHTML = `${safeMessage}${safeTiny}`;
    el.toast.classList.add("show");
    toastTimer = window.setTimeout(() => el.toast.classList.remove("show"), 2600);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      return { items };
    } catch {
      return { items: [] };
    }
  }

  function saveState(items) {
    const payload = { v: 1, updatedAt: nowIso(), items };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function getItems() {
    return loadState().items || [];
  }

  function setItems(items) {
    saveState(items);
    render(items);
  }

  function upsertItem(items, url, note) {
    const id = url;
    const existingIndex = items.findIndex((x) => x.id === id);
    const next = {
      id,
      url,
      note,
      updatedAt: nowIso(),
      createdAt: existingIndex >= 0 ? items[existingIndex].createdAt : nowIso(),
    };

    if (existingIndex >= 0) {
      const copy = items.slice();
      copy.splice(existingIndex, 1);
      return [next, ...copy].slice(0, MAX_ITEMS);
    }

    return [next, ...items].slice(0, MAX_ITEMS);
  }

  async function copyToClipboard(text) {
    const value = String(text || "");
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch {
        return false;
      }
    }
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  function tryOpenSchema(url) {
    const href = normalizeUrl(url);
    if (!href) return false;

    const a = document.createElement("a");
    a.href = href;
    a.rel = "noopener noreferrer";
    // iOS custom schemes in new tabs can be flaky; prefer same tab there.
    a.target = isIOS() ? "_self" : "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  }

  function render(items) {
    el.list.innerHTML = "";
    el.empty.hidden = items.length !== 0;

    for (const item of items) {
      const note = item.note?.trim() ? item.note.trim() : t("itemUntitled");
      const safeNote = escapeHtml(note);
      const safeUrl = escapeHtml(item.url);

      const node = document.createElement("div");
      node.className = "item";
      node.innerHTML = `
        <div class="meta">
          <div class="note">${safeNote}</div>
          <div class="link" title="${safeUrl}">${safeUrl}</div>
        </div>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" data-act="run" data-id="${escapeHtml(item.id)}" type="button" title="Try opening">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>
            ${escapeHtml(t("btnRun"))}
          </button>
          <button class="btn btn-ghost btn-sm" data-act="copy" data-id="${escapeHtml(item.id)}" type="button" title="Copy link">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 9h10v10H9z"></path>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            ${escapeHtml(t("itemCopy"))}
          </button>
          <button class="btn btn-danger btn-sm" data-act="del" data-id="${escapeHtml(item.id)}" type="button" title="Delete">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18"></path>
              <path d="M8 6V4h8v2"></path>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            </svg>
            ${escapeHtml(t("itemDelete"))}
          </button>
        </div>
      `;
      el.list.appendChild(node);
    }
  }

  function handleAdd(urlRaw, noteRaw) {
    const url = normalizeUrl(urlRaw);
    const note = normalizeNote(noteRaw);
    if (!url) {
      showToast(t("toastEnterLink"));
      return false;
    }
    if (!isLikelySchemaUrl(url)) {
      showToast(t("toastBadLink"), t("toastBadLinkTiny"));
      return false;
    }

    const items = getItems();
    const next = upsertItem(items, url, note);
    setItems(next);
    showToast(t("toastSaved"), note ? `${t("note")}: ${note}` : "");
    return true;
  }

  function handleRun(urlRaw) {
    const url = normalizeUrl(urlRaw);
    if (!url) {
      showToast(t("toastEnterLink"));
      return false;
    }
    if (!isLikelySchemaUrl(url)) {
      showToast(t("toastBadLink"), t("toastBadLinkTiny"));
      return false;
    }
    const ok = tryOpenSchema(url);
    if (ok) {
      showToast(t("toastAttempted"), t("toastAttemptedTiny"));
    }
    return ok;
  }

  function exportJson() {
    const payload = loadState();
    return JSON.stringify(payload, null, 2);
  }

  function importJson(text) {
    try {
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      const clean = [];
      for (const it of items) {
        const url = normalizeUrl(it?.url || it?.id);
        if (!url || !isLikelySchemaUrl(url)) continue;
        clean.push({
          id: url,
          url,
          note: normalizeNote(it?.note),
          createdAt: it?.createdAt || nowIso(),
          updatedAt: nowIso(),
        });
        if (clean.length >= MAX_ITEMS) break;
      }
      setItems(clean);
      showToast(t("toastImportOk"), `Total: ${clean.length}`);
    } catch {
      showToast(t("toastImportFail"), t("toastImportFailTiny"));
    }
  }

  function onEnter(input, handler) {
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      if (e.isComposing) return;
      e.preventDefault();
      handler();
    });
  }

  // Wire events
  el.btnQuickRun.addEventListener("click", () => handleRun(el.quickUrl.value));
  el.btnQuickSave.addEventListener("click", () => {
    const ok = handleAdd(el.quickUrl.value, el.quickNote.value);
    if (ok) {
      el.quickUrl.value = "";
      el.quickNote.value = "";
      el.quickUrl.focus();
    }
  });
  el.btnAdd.addEventListener("click", () => {
    const ok = handleAdd(el.newUrl.value, el.newNote.value);
    if (ok) {
      el.newUrl.value = "";
      el.newNote.value = "";
      el.newUrl.focus();
    }
  });
  el.btnPaste.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        showToast(t("toastClipboardEmpty"));
        return;
      }
      el.newUrl.value = text.trim();
      el.newUrl.focus();
      showToast(t("toastPasted"));
    } catch {
      showToast(t("toastClipboardNoRead"), t("toastClipboardNoReadTiny"));
    }
  });
  el.btnClearAll.addEventListener("click", () => {
    const items = getItems();
    if (items.length === 0) {
      showToast(t("toastAlreadyEmpty"));
      return;
    }
    const ok = window.confirm(t("confirmClear"));
    if (!ok) return;
    setItems([]);
    showToast(t("toastCleared"));
  });
  el.btnExport.addEventListener("click", async () => {
    const text = exportJson();
    const ok = await copyToClipboard(text);
    showToast(ok ? t("toastExportOk") : t("toastExportFail"));
  });
  el.btnImport.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        showToast(t("toastClipboardEmpty"), t("toastImportEmptyTiny"));
        return;
      }
      importJson(text);
    } catch {
      showToast(t("toastClipboardNoRead"), t("toastClipboardNoReadTiny"));
    }
  });

  onEnter(el.quickUrl, () => handleRun(el.quickUrl.value));
  onEnter(el.quickNote, () => el.btnQuickSave.click());
  onEnter(el.newUrl, () => el.btnAdd.click());
  onEnter(el.newNote, () => el.btnAdd.click());

  el.list.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const act = btn.getAttribute("data-act");
    const id = btn.getAttribute("data-id");
    const items = getItems();
    const item = items.find((x) => x.id === id);
    if (!item) return;

    if (act === "run") {
      handleRun(item.url);
      return;
    }
    if (act === "copy") {
      const ok = await copyToClipboard(item.url);
      showToast(ok ? t("toastCopied") : t("toastCopyFail"));
      return;
    }
    if (act === "del") {
      const name = item.note?.trim() ? item.note.trim() : t("itemUntitled");
      const ok = window.confirm(`${t("confirmDeletePrefix")} "${name}" ?`);
      if (!ok) return;
      const next = items.filter((x) => x.id !== id);
      setItems(next);
      showToast(t("toastDeleted"));
    }
  });

  // Initial render + first-time defaults
  currentLang = detectLang();
  applyLang(currentLang);

  // Avatar fallback: show "P" if image missing.
  if (el.avatarImg && el.avatarWrap) {
    const mark = () => {
      if (el.avatarImg.complete && el.avatarImg.naturalWidth > 0) {
        el.avatarWrap.classList.add("has-img");
      }
    };
    el.avatarImg.addEventListener("load", mark);
    el.avatarImg.addEventListener("error", () => el.avatarWrap.classList.remove("has-img"));
    mark();
  }

  el.btnLang.addEventListener("click", () => {
    const next = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem(LANG_KEY, next);
    applyLang(next);
    render(getItems());
  });

  const { items } = loadState();
  render(items);

  el.quickExample.textContent = `Example: ${EXAMPLE_URL}`;

  el.quickNote.placeholder = `e.g. ${EXAMPLE_NOTE_ZH}`;
  el.newNote.placeholder = `e.g. ${EXAMPLE_NOTE_ZH}`;

  if (!items || items.length === 0) {
    el.quickUrl.value = EXAMPLE_URL;
    el.quickNote.value = EXAMPLE_NOTE_ZH;
  }
})();
