function addCheckbox() {
  const itemName = prompt("追加する項目名を入力してください");
  if (!itemName) return;

  const wrapper = document.createElement("div");
  wrapper.className = "checkbox-item";
  wrapper.draggable = true; // ドラッグ可能にする

  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", saveData);

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" " + itemName));

  const delBtn = document.createElement("button");
  delBtn.textContent = "削除";
  delBtn.onclick = function () {
    wrapper.remove();
    saveData();
  };

  wrapper.appendChild(label);
  wrapper.appendChild(delBtn);

  const area = document.getElementById("checkbox-area");
  area.appendChild(wrapper);

  addDragAndDrop(wrapper);
  saveData();
}

// --- ドラッグ & ドロップ処理 ---
function addDragAndDrop(element) {
  element.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", null);
    element.classList.add("dragging");
  });

  element.addEventListener("dragend", () => {
    element.classList.remove("dragging");
    saveData();
  });

  const area = document.getElementById("checkbox-area");
  area.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(area, e.clientY);
    if (afterElement == null) {
      area.appendChild(dragging);
    } else {
      area.insertBefore(dragging, afterElement);
    }
  });
}

// マウス位置から挿入位置を判定
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".checkbox-item:not(.dragging)")];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// --- リセット ---
function resetCheckboxes() {
  const checkboxes = document.querySelectorAll("#checkbox-area input[type='checkbox']");
  checkboxes.forEach(cb => cb.checked = false);
  saveData();
}

// --- 保存 ---
function saveData() {
  const items = [];
  const wrappers = document.querySelectorAll("#checkbox-area .checkbox-item");
  wrappers.forEach(wrapper => {
    const checkbox = wrapper.querySelector("input[type='checkbox']");
    const text = wrapper.innerText.replace("削除", "").trim();
    items.push({ name: text, checked: checkbox.checked });
  });
  localStorage.setItem("checkboxData", JSON.stringify(items));
}

// --- 復元 ---
function loadData() {
  const data = localStorage.getItem("checkboxData");
  if (!data) return;

  const items = JSON.parse(data);
  const area = document.getElementById("checkbox-area");
  area.innerHTML = "";

  items.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.className = "checkbox-item";
    wrapper.draggable = true;

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;
    checkbox.addEventListener("change", saveData);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + item.name));

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.onclick = function () {
      wrapper.remove();
      saveData();
    };

    wrapper.appendChild(label);
    wrapper.appendChild(delBtn);

    area.appendChild(wrapper);
    addDragAndDrop(wrapper);
  });
}

window.onload = loadData;
