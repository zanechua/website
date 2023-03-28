// Adapted from https://github.com/PrismJS/prism/blob/master/plugins/line-numbers/prism-line-numbers.js#L82-L172
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

  for (let a = 0, l = infos.length; a < l; a += 1) {
    const info = infos[a];
    const lineNumberSizer = info.sizer;
    const { lines } = info;
    const { lineHeights } = info;
    const { oneLinerHeight } = info;
    const wrapper = info.element.querySelector('.line-numbers-rows');

    lineHeights[lines.length - 1] = undefined;

    for (let i = 0, ll = lines.length; i < ll; i += 1) {
      const line = lines[i];
      if (line && line.length > 1) {
        const e = lineNumberSizer.appendChild(document.createElement('span'));
        e.style.display = 'block';
        e.textContent = line;
        const { height } = e.getBoundingClientRect();
        wrapper.children[i].style.height = `${height}px`;
      } else {
        lineHeights[i] = oneLinerHeight;
      }
    }

    lineNumberSizer.style.display = 'none';
    lineNumberSizer.innerHTML = '';
  }
}

export { resizeElements };
