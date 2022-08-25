import { subprocess, fs } from "@jspawn/jspawn";

export default class PDFPagePicker extends HTMLElement {
  constructor(input) {
    super();
    this.input = input;
    this.deps = new Set(["styles.css"]);
    this.pageWidth = 200;
    this.pageHeight = Math.round((this.pageWidth / 8.5) * 11);
    this.marginX = input.allowSplit ? 20 : 6;
    this.marginY = 10;
    this.batchSize = 10;
    this.base = Object.assign(document.createElement("div"), {
      className: "base",
      style: "display:none",
      onclick: this.onClick.bind(this),
      onmousedown: this.onMouseDown.bind(this),
    });
    this.splitContainerEl = Object.assign(document.createElement("div"), {
      className: "split-container",
    });
    this.base.append(this.splitContainerEl);
    this.containerEl = Object.assign(document.createElement("div"), {
      className: "container",
    });
    this.base.append(this.containerEl);
    this.pages = [];
    this.mouse = {};
    this.shadowContainerEl = Object.assign(document.createElement("div"), {
      className: "shadow-container",
    });
    this.base.append(this.shadowContainerEl);
    this.moveIndicatorEl = Object.assign(document.createElement("div"), {
      className: "move-indicator",
    });
    this.moveIndicatorHeight = this.pageHeight + 20;
    this.moveIndicatorEl.style.height = `${this.moveIndicatorHeight}px`;
    this.base.append(this.moveIndicatorEl);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(
      ...Array.from(this.deps.values()).map((href) =>
        Object.assign(document.createElement("link"), {
          rel: "stylesheet",
          href,
          onload: () => {
            this.deps.delete(href);
            this.connectedCallback();
          },
        })
      ),
      this.base
    );

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  async connectedCallback() {
    if (this.deps.size || this.connected) return;
    this.connected = true;

    this.base.style.display = "";

    this.base.addEventListener("scroll", this.onScroll.bind(this));
    this.requestRender();
  }

  submittedCallback() {
    this.emitChange();
  }

  onMouseDown(e) {
    if (!this.input.allowMove) return;

    const { from, page, target } = this.pageForEvent(e);
    if (target && target.id.startsWith("page-")) {
      Object.assign(this.mouse, {
        dragging: true,
        target,
        clientX: e.clientX,
        clientY: e.clientY,
        pageState: this.findPage(from, page),
        xPageState: undefined,
      });
    }
  }

  onMouseUp(e) {
    if (this.mouse.shadowEl) {
      e.preventDefault();
      this.base.classList.remove("moving");
      this.shadowContainerEl.style.display = "";
      this.mouse.shadowEl.remove();
      this.moveIndicatorEl.style.display = "";

      if (this.mouse.xPageState) {
        const moveFrom = this.pages.indexOf(this.mouse.pageState);
        let moveTo = this.pages.indexOf(this.mouse.xPageState);
        if (moveFrom < moveTo && !this.mouse.trailing) {
          moveTo -= 1;
        } else if (moveFrom > moveTo && this.mouse.trailing) {
          moveTo += 1;
        }
        if (moveFrom !== moveTo) {
          const insertEl = this.pages[moveFrom].pageEl;
          insertEl.remove();
          const beforeEl = Array.from(this.containerEl.children)[moveTo];
          this.containerEl.insertBefore(insertEl, beforeEl);
          this.pages.splice(moveTo, 0, this.pages.splice(moveFrom, 1)[0]);
          this.updatePageRects();
          this.emitChange();
        }
      }

      // Prevent next click.
      setTimeout(() => {
        delete this.mouse.shadowEl;
      });
    }
    this.mouse.dragging = false;
  }

  onMouseMove(e) {
    let dx = e.clientX - this.mouse.clientX;
    let dy = e.clientY - this.mouse.clientY;
    if (
      this.mouse.dragging &&
      (this.mouse.shadowEl || Math.max(Math.abs(dx), Math.abs(dy)) > 5)
    ) {
      e.preventDefault();
      if (!this.mouse.shadowEl) {
        this.base.classList.add("moving");
        this.mouse.clientX = e.clientX;
        this.mouse.clientY = e.clientY;
        dx = dy = 0;
        this.mouse.shadowEl = this.mouse.target.cloneNode(true);
        this.shadowContainerEl.append(this.mouse.shadowEl);
        this.shadowContainerEl.style.display = "block";
        Object.assign(this.shadowContainerEl.style, {
          display: "block",
          top: `${this.mouse.target.offsetTop - this.marginY}px`,
          left: `${this.mouse.target.offsetLeft - this.marginX}px`,
        });
      }
      dx = e.clientX - this.mouse.clientX;
      dy = e.clientY - this.mouse.clientY;
      this.shadowContainerEl.style.transform = `translate(${dx}px, ${dy}px)`;
      const rect = this.mouse.pageState.rect;
      this.mouse.rect = {
        x1: rect.x1 + dx,
        x2: rect.x2 + dx,
        y1: rect.y1 + dy,
        y2: rect.y2 + dy,
      };
      this.requestRenderMoveIndicator();
    }
  }

  requestRenderMoveIndicator() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(() =>
      this.renderMoveIndicator()
    );
  }

  renderMoveIndicator() {
    let xPageState, xArea;
    for (const pageState of this.pages) {
      if (pageState === this.mouse.pageState) continue;
      const x = calcIntersection(this.mouse.rect, pageState.rect);
      if (x) {
        const area = Math.abs(x.x1 - x.x2) * Math.abs(x.y1 - x.y2);
        if (!xArea || area > xArea) {
          xArea = area;
          xPageState = pageState;
        }
      }
    }
    const trailing =
      xPageState && midpointX(this.mouse.rect) > midpointX(xPageState.rect);
    if (
      xPageState !== this.mouse.xPageState ||
      trailing !== this.mouse.trailing
    ) {
      if (xPageState) {
        const x = trailing
          ? xPageState.rect.x2 + this.marginX
          : xPageState.rect.x1 - this.marginX;
        const y =
          xPageState.rect.y1 - (this.moveIndicatorHeight - this.pageHeight) / 2;
        Object.assign(this.moveIndicatorEl.style, {
          display: "block",
          transform: `translate(${x}px, ${Math.round(y)}px)`,
        });
      } else {
        this.moveIndicatorEl.style.display = "";
      }
      this.mouse.xPageState = xPageState;
      this.mouse.trailing = trailing;
    }
  }

  onClick(e) {
    if (this.mouse.shadowEl) return;

    if (e.target.id && e.target.id.startsWith("split-")) {
      e.target.classList.toggle("active");
      this.emitChange();
      return;
    }

    const { from, page, target } = this.pageForEvent(e);
    if (target) {
      this.onPageClick(this.findPage(from, page), target);
    }
  }

  pageForEvent(e) {
    let el = this.shadowRoot.elementFromPoint(e.clientX, e.clientY);
    let target;
    while (el) {
      if (el.id) target = target || el;
      if (el.id && el.id.startsWith("page-")) {
        const parts = el.id.split("-").slice(1);
        return { from: parseInt(parts[0]), page: parseInt(parts[1]), target };
      } else {
        el = el.parentElement;
      }
    }
    return {};
  }

  findPage(from, page) {
    return this.pages.find(
      (pageState) => pageState.from === from && pageState.page === page
    );
  }

  onPageClick(pageState, target) {
    switch (target.id) {
      case "rotate":
      case "rotate-cc": {
        const inc = target.id === "rotate" ? 90 : -90;
        let rotate = (pageState.rotate || 0) + inc;
        rotate = rotate % 360;
        if (rotate < 0) rotate += 360;

        this.rotatePage(pageState.pageEl, pageState.initRotate + rotate);

        pageState.rotate = rotate;
        break;
      }
      case "delete": {
        this.pages.splice(this.pages.indexOf(pageState), 1);
        pageState.pageEl.remove();
        if (this.splitContainerEl.lastElementChild) {
          this.splitContainerEl.lastElementChild.remove();
        }
        break;
      }
      default: {
        if (this.input.allowSelect) {
          pageState.selected = !pageState.selected;
          pageState.pageEl.classList.toggle("selected");
        } else {
          return;
        }
      }
    }

    this.emitChange();
  }

  emitChange() {
    const docs = [];
    const rotate = {};
    let pagePos = 0;
    let pageState;
    while (true) {
      const doc = [];
      let pages = [];
      let from;
      const maybePushChunk = () => {
        if (pages.length > 0) {
          doc.push({
            from: this.input.pdfFiles[from].name,
            pages: compressPageSelection(pages),
          });
          pages = [];
        }
      };
      while (true) {
        pageState = this.pages[pagePos];
        if (!pageState) break;
        if (from !== pageState.from) {
          maybePushChunk();
          from = pageState.from;
        }
        if (
          (this.input.allowSelect && pageState.selected) ||
          !this.input.allowSelect
        ) {
          pages.push(pageState.page);
        }

        if (pageState.rotate) {
          rotate[pageState.rotate] = rotate[pageState.rotate] || [];
          // Assuming rotation is applied after pages are reordered/deleted.
          rotate[pageState.rotate].push(pagePos + 1);
        }

        const splitEl = this.splitContainerEl.children[pagePos];
        pagePos += 1;
        if (splitEl && splitEl.firstChild.classList.contains("active")) {
          maybePushChunk();
          break;
        }
      }
      maybePushChunk();
      if (doc.length > 0) {
        docs.push(doc);
      }
      if (!pageState) break;
    }

    const detail = {
      docs,
      rotate: Array.from(Object.entries(rotate)).map(([angle, pages]) => ({
        angle: parseInt(angle),
        pages: compressPageSelection(pages),
      })),
    };
    this.dispatchEvent(new CustomEvent("change", { detail }));
  }

  onScroll() {
    this.requestRender();
  }

  requestRender() {
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(async () => {
      if (this.rendering) {
        this.requestRender();
      } else {
        this.rendering = true;
        await this.render();
        this.rendering = false;
      }
    });
  }

  async render() {
    if (!this.pageCounts) {
      this.pageCounts = [];
      for (const [filePos, file] of this.input.pdfFiles.entries()) {
        const output = await subprocess.run("qpdf", ["--json", file.path]);

        const json = JSON.parse(output.stdout);

        this.pageCounts.push(json.pages.length);

        const pageEls = [];
        for (const [pos, page] of json.pages.entries()) {
          const obj = json.objects[`obj:${page.object}`];
          const rotate = (obj && obj.value && obj.value["/Rotate"]) || 0;
          const pageState = this.renderPage(filePos, pos + 1, rotate);
          pageEls.push(pageState.pageEl);
          this.pages.push(pageState);
        }
        this.containerEl.append(...pageEls);
      }
      if (this.input.allowSplit) {
        const splitEls = this.pages.slice(1).map((_, pos) => {
          const el = document.createElement("div");
          Object.assign(el.style, {
            width: `${this.pageWidth + this.marginX * 2}px`,
            height: `${Math.round(this.pageHeight + this.marginY * 2)}px`,
          });
          const targetEl = Object.assign(document.createElement("div"), {
            id: `split-${pos}`,
            className: "split-target",
            innerHTML: svg([
              '<path d="M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61 3.5 3.5zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"/>',
            ]),
          });
          Object.assign(targetEl.style, {
            width: `${this.marginX * 2}px`,
            outlineOffset: `-${this.marginX * 2}px`,
          });
          el.append(targetEl);
          return el;
        });
        this.splitContainerEl.append(...splitEls);
        this.splitContainerEl.style.paddingLeft = `${this.marginX}px`;
      }
      this.updatePageRects();
    }

    const pagesToRender = this.visiblePages()
      .map((pos) => this.pages[pos])
      .filter((pageState) => !pageState.rendered)
      .slice(0, this.batchSize);

    if (pagesToRender.length === 0) return;

    const groupedPagesToRender = pagesToRender.reduce((acc, pageState) => {
      const key = pageState.from;
      if (!acc[key]) acc[key] = [];
      acc[key].push(pageState);
      return acc;
    }, {});

    for (const [from, pages] of Object.entries(groupedPagesToRender)) {
      const file = this.input.pdfFiles[parseInt(from)];

      const renderWidth = Math.ceil(this.pageWidth / 4) * 4;
      await subprocess.run("pdfr", [
        "render",
        `--size=${renderWidth}x`,
        `--pages=${pages.map((pageState) => pageState.page).join(",")}`,
        file.path,
        "out",
      ]);

      const ents = await fs.readdir("out");
      for (const [pos, ent] of ents.entries()) {
        const blob = await fs.readFileToBlob(`out/${ent}`, {
          type: "image/jpeg",
        });
        const url = URL.createObjectURL(blob);
        const pageState = pages[pos];
        pageState.pageEl.firstChild.style.backgroundImage = `url(${url})`;
        pageState.rendered = true;
      }

      await fs.rmdir("out", { recursive: true });
    }

    await this.render();
  }

  renderPage(from, page, rotate) {
    const pageEl = Object.assign(document.createElement("div"), {
      id: `page-${from}-${page}`,
      className: "page",
    });
    Object.assign(pageEl.style, {
      width: `${this.pageWidth}px`,
      height: `${this.pageHeight}px`,
      margin: `${this.marginY}px ${this.marginX}px`,
      cursor: this.input.allowMove ? "move" : "pointer",
    });

    pageEl.append(
      Object.assign(document.createElement("div"), {
        className: "page-bg",
      })
    );

    if (rotate) {
      this.rotatePage(pageEl, rotate);
    }

    const pageState = { from, page, pageEl, initRotate: rotate };

    if (this.input.allowSelect) {
      pageState.checkboxEl = Object.assign(document.createElement("div"), {
        className: "checkbox",
        innerHTML: svg([
          '<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>',
        ]),
      });
      pageEl.append(pageState.checkboxEl);
    }

    const toolbarEl = Object.assign(document.createElement("div"), {
      className: "toolbar",
    });

    if (this.input.allowRotate) {
      toolbarEl.append(
        Object.assign(document.createElement("button"), {
          id: "rotate-cc",
          type: "button",
          className: "toolbar-btn",
          innerHTML: svg([
            '<path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>',
            '<path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>',
          ]),
        }),
        Object.assign(document.createElement("button"), {
          id: "rotate",
          type: "button",
          className: "toolbar-btn",
          innerHTML: svg([
            '<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>',
            '<path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>',
          ]),
        })
      );
    }

    if (this.input.allowDelete) {
      toolbarEl.append(
        Object.assign(document.createElement("button"), {
          id: "delete",
          type: "button",
          className: "toolbar-btn",
          innerHTML: svg([
            '<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>',
          ]),
        })
      );
    }

    if (toolbarEl.children.length > 0) {
      pageState.pageEl.append(toolbarEl);
    }

    return pageState;
  }

  rotatePage(pageEl, rotate) {
    const scale = rotate % 180 > 0 ? this.pageWidth / this.pageHeight : 1;
    pageEl.firstChild.style.transform = `rotate(${rotate}deg) scale(${scale})`;
  }

  visiblePages() {
    const cellWidth = this.pageWidth + this.marginX * 2;
    const cellHeight = this.pageHeight + this.marginY * 2;
    const baseWidth = this.base.clientWidth;
    const baseHeight = this.base.clientHeight;
    const cellsWide = Math.floor(baseWidth / cellWidth);
    const scrollTop = this.base.scrollTop;

    const firstVisible = Math.floor(scrollTop / cellHeight) * cellsWide;
    const lastVisible =
      Math.ceil((scrollTop + baseHeight) / cellHeight) * cellsWide;

    const visiblePages = [];
    for (let i = firstVisible; i < lastVisible; i++) {
      if (i < this.pages.length) {
        visiblePages.push(i);
      }
    }
    return visiblePages;
  }

  updatePageRects() {
    for (const pageState of this.pages) {
      const el = pageState.pageEl;
      pageState.rect = {
        x1: el.offsetLeft,
        x2: el.offsetLeft + this.pageWidth,
        y1: el.offsetTop,
        y2: el.offsetTop + this.pageHeight,
      };
    }
  }
}

function svg(inner) {
  inner = inner.join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">${inner}</svg>`;
}

function compressPageSelection(pages) {
  const compressed = [];
  for (let i = 0; i < pages.length; i++) {
    const start = pages[i];
    let end = start;
    while (pages[i + 1] === end + 1) {
      end += 1;
      i += 1;
    }
    if (start === end) {
      while (pages[i + 1] === end - 1) {
        end -= 1;
        i += 1;
      }
    }
    if (start !== end) {
      compressed.push(`${start}-${end}`);
    } else {
      compressed.push(start);
    }
  }
  return compressed.join(",");
}

function calcIntersection(r1, r2) {
  [r1, r2] = [r1, r2].map((r) => {
    return {
      x: [r.x1, r.x2],
      y: [r.y1, r.y2],
    };
  });

  const noIntersect =
    r2.x[0] > r1.x[1] ||
    r2.x[1] < r1.x[0] ||
    r2.y[0] > r1.y[1] ||
    r2.y[1] < r1.y[0];

  return noIntersect
    ? false
    : {
        x1: Math.max(r1.x[0], r2.x[0]), // _[0] is the lesser,
        y1: Math.max(r1.y[0], r2.y[0]), // _[1] is the greater
        x2: Math.min(r1.x[1], r2.x[1]),
        y2: Math.min(r1.y[1], r2.y[1]),
      };
}

function midpointX(r) {
  return r.x1 + (r.x2 - r.x1) / 2;
}
