---
slug: 'proper-line-number-height-prismjs-gatsby'
date: '2023-03-31'
featuredImage: '../assets/featured/proper-line-number-height-prismjs-gatsby.png'
title: 'Proper Line Number Height in PrismJS with Gatsby'
tags: ['gatsby', 'node', 'react', 'javascript']
---

Configuring the `gatsby-remark-prismjs` plugin for `prism.js` in Gatsby works pretty well except for the fact that if your line of code overflows into the next line, the default configuration that's provided does not cater for that. I went digging through the source code, through the typical implementation of `prism.js` and found out that there is a snippet of code that is typically ran on the client side to recalculate the height of each line and adjust it accordingly.

There's no solution that is documented in `gatsby-remark-prismjs` except for the adaptations that's been made and to refer back to client side implementation of `prism.js`

Here's my solution to get proper line height for each line even if it overflows.

# Solve

```bash:title=terminal
yarn add @react-hook/window-size
```

Place the `prism-multiline-numbers.js` file in your code libraries where you are able to import the function.

```javascript:title=prism-multiline-numbers.js
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
```

In your `Template` code, we'll trigger the function on post load and when the browser window is being resized

```javascript:title=Template.jsx
const Template = ({}) => {
  const [width, height] = useWindowSize();

  useEffect(() => {
    resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers')));
  }, [width, height]);

  useEffect(() => {
    // create an Observer instance
    const resizeObserver = new ResizeObserver(() => {
      resizeElements(Array.prototype.slice.call(document.querySelectorAll('pre.line-numbers')));
    });

    resizeObserver.disconnect();
    const contentElement = document.getElementById('post-content');
    // start observing a DOM node
    resizeObserver.observe(contentElement);
  }, []);

  return (<></>);
};
```

If you're unsure how all these come together, you can take a look at the repository for this blog at [https://github.com/zanechua/website](https://github.com/zanechua/website).
