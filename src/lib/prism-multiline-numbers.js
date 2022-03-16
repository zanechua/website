const NEW_LINE_EXP = /\n(?!$)/g;

function getStyles(element) {
  if (!element) {
    return null;
  }

  return window.getComputedStyle ? getComputedStyle(element) : element.currentStyle || null;
}

function resizeElements(elementToResize) {
  const elements = elementToResize.filter(e => {
    const codeStyles = getStyles(e);
    const whiteSpace = codeStyles['white-space'];
    return whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line';
  });

  if (elements.length === 0) {
    return;
  }

  const infos = elements
    .map(element => {
      const codeElement = element.querySelector('code');
      const lineNumbersWrapper = element.querySelector('.line-numbers-rows');
      if (!codeElement || !lineNumbersWrapper) {
        return undefined;
      }

      /** @type {HTMLElement} */
      let lineNumberSizer = element.querySelector('.line-numbers-sizer');
      const codeLines = codeElement.textContent.split(NEW_LINE_EXP);

      if (!lineNumberSizer) {
        lineNumberSizer = document.createElement('span');
        lineNumberSizer.className = 'line-numbers-sizer';

        codeElement.appendChild(lineNumberSizer);
      }

      lineNumberSizer.innerHTML = '0';
      lineNumberSizer.style.display = 'block';

      const oneLinerHeight = lineNumberSizer.getBoundingClientRect().height;
      lineNumberSizer.innerHTML = '';

      return {
        element,
        lines: codeLines,
        lineHeights: [],
        oneLinerHeight,
        sizer: lineNumberSizer
      };
    })
    .filter(Boolean);

  infos.forEach(info => {
    const lineNumberSizer = info.sizer;
    const { lines } = info;
    const { lineHeights } = info;
    const { oneLinerHeight } = info;

    lineHeights[lines.length - 1] = undefined;
    lines.forEach((line, index) => {
      if (line && line.length > 1) {
        const e = lineNumberSizer.appendChild(document.createElement('span'));
        e.style.display = 'block';
        e.textContent = line;
      } else {
        lineHeights[index] = oneLinerHeight;
      }
    });
  });

  infos.forEach(info => {
    const lineNumberSizer = info.sizer;
    const { lineHeights } = info;

    const childIndex = 0;
    for (let i = 0; i < lineHeights.length; i + 1) {
      if (lineHeights[i] === undefined) {
        lineHeights[i] = lineNumberSizer.children[childIndex + 1].getBoundingClientRect().height;
      }
    }
  });

  infos.forEach(info => {
    const lineNumberSizer = info.sizer;
    const wrapper = info.element.querySelector('.line-numbers-rows');

    lineNumberSizer.style.display = 'none';
    lineNumberSizer.innerHTML = '';

    info.lineHeights.forEach((height, lineNumber) => {
      wrapper.children[lineNumber].style.height = `${height}px`;
    });
  });
}

export { resizeElements };
