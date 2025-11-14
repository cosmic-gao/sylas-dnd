// @ts-nocheck

const zones = document.querySelectorAll('[dropzone="true"]');

function getOverlapArea(target, source, offsetX = 0, offsetY = 0) {
  const tRect = target.getBoundingClientRect();
  const sRect = source.getBoundingClientRect();

  const t = {
    left: tRect.left + offsetX,
    right: tRect.right + offsetX,
    top: tRect.top + offsetY,
    bottom: tRect.bottom + offsetY
  };

  const left = Math.max(sRect.left, t.left)
  const right = Math.min(sRect.right, t.right)
  const top = Math.max(sRect.top, t.top)
  const bottom = Math.min(sRect.bottom, t.bottom)

  if (right < left || bottom < top) return 0

  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  return width * height;
}

// 根据父子嵌套 + 面积最大选择最佳 dropzone
function chooseBestZone(element, offsetX = 0, offsetY = 0) {
  let intersections = [];

  for (const zone of zones) {
    const area = getOverlapArea(element, zone, offsetX, offsetY);
    if (area > 0) {
      intersections.push({ zone, area });
    }
  }

  if (!intersections.length) return null;

  // 按面积降序排序
  intersections.sort((a, b) => b.area - a.area);

  // 优先选择没有更深嵌套子元素的 zone
  for (let i = 0; i < intersections.length; i++) {
    const candidate = intersections[i];
    let isChildPreferred = true;

    for (let j = 0; j < intersections.length; j++) {
      if (i === j) continue;
      if (candidate.zone.contains(intersections[j].zone)) {
        isChildPreferred = false;
        break;
      }
    }

    if (isChildPreferred) return candidate.zone;
  }

  // fallback: 面积最大
  return intersections[0].zone;
}

function getHitElement(element, offsetX, offsetY) {
  const bestZone = chooseBestZone(element, offsetX, offsetY);
  return bestZone;
}

const el = document.getElementById('drag0')

let startMouseX, startMouseY;

el.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', 'dragged');
  startMouseX = e.clientX;
  startMouseY = e.clientY;
});

let rafId = null;

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dx = e.clientX - startMouseX;
  const dy = e.clientY - startMouseY;

  if (rafId) cancelAnimationFrame(rafId);

  rafId = requestAnimationFrame(() => {
    const targetZone = getHitElement(el, dx, dy);

    zones.forEach(z => z.classList.remove('highlight'));
    if (targetZone) targetZone.classList.add('highlight');

    console.log(targetZone?.id);
  });
});
