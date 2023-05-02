const Keyboard = {
  elements: {
    main: null,
    titleContainer: null,
    textContainer: null,
    keysContainer: null,
    keys: []
  },
  properties: {
    value: "",
    language: true,
    capsLock: false,
    shift: false,
    ctrl: false,
    alt: false,
    direction: "none",
    start: 0,
    end: 0
  },
  eventHandlers: {
    oninput: null,
    onclose: null
  },

  init() {
    //Create elements
    this.elements.main = document.createElement("div");
    this.elements.main.classList.add("keyboard");

    this.elements.titleContainer = document.createElement("div");
    this.elements.titleContainer.classList.add("keyboard__table-title");
    this.elements.titleContainer.innerHTML = ("RSS Virtual Keyboard");
    this.elements.main.appendChild(this.elements.titleContainer);
    document.body.appendChild(this.elements.main);

    this.elements.textContainer = document.createElement("textarea");
    this.elements.textContainer.classList.add("keyboard__table-text");
    this.elements.textContainer.placeholder = ("Клавиатура создана в операционной системе Windows.\n\nРеализовано:\n- выделение напечатанного текста shift+left/right\n- замена регистра при зелёном индикаторе capslock\n- замена цифр на символы при зелёном индикаторе shift\n- удаление символов при нажатии delete/backspace\n- красивая кнопочка \"Lang\" для переключения языка, тк это экранная клавиатура и зажимать одновременно мышкой пару кнопок не совсем удобно.\n\nДля активации экранной клавиатуры нажмите на поле отображения текста.");
    this.elements.main.appendChild(this.elements.textContainer);
    document.body.appendChild(this.elements.main);

    this.elements.keysContainer = document.createElement("div");
    this.elements.keysContainer.classList.add("keyboard__table-keys", "hidden");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__table-key");
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    let input = document.querySelector(".keyboard__table-text");
    document.querySelectorAll(".keyboard__table-text").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
      element.addEventListener("click", () => {
        this.properties.start = input.selectionStart;
        this.properties.end = input.selectionEnd;
      });
      element.addEventListener("keypress", key => {
        this.properties.value += key.key;
        this.open(element.value, currentValue => {
          if (this.properties.start > element.value.length) {
            element.value += currentValue.substring(currentValue.length - 1, currentValue.length);
          } else {
            element.value = element.value.substring(0, this.properties.start - 1) +
              currentValue.substring(this.properties.start - 1, this.properties.end) +
              element.value.substring(this.properties.end - 1, element.value.length);
          }
        });
        this.properties.start++;
        this.properties.end++;
      });
      element.addEventListener("keydown", key => {
        if (key.which === 65) {
          this.properties.start--;
          this.properties.end--;
          if (this.properties.start < 0) this.properties.start = 0;
          if (this.properties.end < 0) this.properties.end = 0;
        }
        if (key.which === 66) {
          this.properties.start++;
          this.properties.end++;
          if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
          if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
        }
      });
    });
  },

  _createKeys() {
    let input = document.querySelector(".keyboard__table-text");
    const nextLine = document.createDocumentFragment();
    const enKey = [
      ["`", "~"],
      ["1", "!"],
      ["2", "@"],
      ["3", "#"],
      ["4", "$"],
      ["5", "%"],
      ["6", "^"],
      ["7", "&"],
      ["8", "*"],
      ["9", "("],
      ["0", ")"],
      ["-", "_"],
      ["=", "+"],
      "backspace",
      "tab",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      ["[", "{"],
      ["]", "}"],
      "delete",
      "empty",
      "caps",
      "a", "s", "d", "f", "g", "h", "j", "k", "l",
      [";", ":"],
      ["'", "\""],
      "enter",
      "shift",
      "z", "x", "c", "v", "b", "n", "m",
      [",", "<"],
      [".", ">"],
      ["/", "?"],
      "pgUp",
      "shift",
      "ctrl",
      "alt",
      "space",
      "alt",
      "ctrl",
      "en",
      "right",
      "pgDn",
      "left",
    ];
    const ruKey = [
      "ё", 
      ["1", "!"],
      ["2", "\""],
      ["3", "№"],
      ["4", ";"],
      ["5", "%"],
      ["6", ":"],
      ["7", "?"],
      ["8", "*"],
      ["9", "("],
      ["0", ")"],
      ["-", "_"],
      ["=", "+"],
      "backspace",
      "tab",
      "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
      "delete",
      "empty",
      "caps",
      "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э",
      "enter",
      "shift",
      "я", "ч", "с", "м", "и", "т", "ь", "б", "ю",
      [".", ","],
      "pgUp",
      "shift",
      "ctrl",
      "alt",
      "space",
      "alt",
      "ctrl",
      "ru",
      "right",
      "pgDn",
      "left"
    ];

    //Create HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    if (this.properties.language) {
      keyLayout = enKey;
      keyLayout.value = "English";
    } else {
      keyLayout = ruKey;
      keyLayout.value = "Русский язык";
    }

    if (this.properties.shift)
      for (let i = 0; i < keyLayout.length; i++)
        if (typeof keyLayout[i] !== "string")
          keyLayout[i].reverse();

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["empty", "enter", "backspace"].indexOf(key) !== -1;
      keyElement.classList.add("keyboard__table-key");
      keyElement.setAttribute("type", "button");

      switch (key) {
        case "backspace":
          keyElement.classList.add("backspace");
          keyElement.innerHTML = createIconHTML("Backspace");
          keyElement.addEventListener("click", () => {
            const index = input.selectionStart;
            this.properties.value = this.properties.value.substring(0, index - 1) + this.properties.value.substring(index);
            this._triggerEvent("oninput");
            input.focus();
            input.selectionStart = index - 1;
            input.selectionEnd = index - 1;
          });
          break;

        case "delete":
          keyElement.classList.add("delete");
          keyElement.innerHTML = createIconHTML("Delete");
          keyElement.addEventListener("click", () => {
            const index = input.selectionStart;
            const newValue = input.value.substring(0, index) + input.value.substring(index + 1);
            this._triggerEvent("oninput");
            input.focus();
            input.value = newValue;
            input.selectionStart = index;
            input.selectionEnd = index;
          });
          break;

        case "tab":
            keyElement.classList.add("tab");
            keyElement.innerHTML = createIconHTML("Tab");
            keyElement.addEventListener("click", () => {
              this.properties.value = this.properties.value + "    ";
              this._triggerEvent("oninput");
              input.focus();
            });
            break;

        case "caps":
          keyElement.classList.add("caps", "activatable");
          keyElement.innerHTML = createIconHTML("CapsLock");
          if (this.properties.capsLock === true) keyElement.classList.toggle("caps");
          keyElement.addEventListener("click", () => {
            this._functionCapsLock();
            keyElement.classList.toggle("active", this.properties.capsLock);
            keyElement.classList.remove("caps", this.properties.capsLock);
            keyElement.classList.toggle("caps");
            input.focus();
          });
          break;
        
        case "enter":
          keyElement.classList.add("enter");
          keyElement.innerHTML = createIconHTML("ENTER");
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.start) + "\n" + this.properties.value.substring(this.properties.end, this.properties.value.length);
            let range = this.properties.end - this.properties.start;
            if (range > 0) {
              this.properties.end -= range;
            }
            this.properties.start++;
            this.properties.end++;
            this._triggerEvent("oninput");
            input.focus();
            input.setSelectionRange(this.properties.start, this.properties.end);
          });
          break;

        case "shift":
          keyElement.classList.add("shift", "activatable");
          keyElement.textContent = key.toLowerCase();
          if (this.properties.shift === true) keyElement.classList.toggle("shift");
          keyElement.addEventListener("click", () => {
            this.properties.shift = !this.properties.shift;
            keyElement.classList.toggle("active", this.properties.shift);
            keyElement.classList.remove("shift", this.properties.shift);
            keyElement.classList.toggle("shift");
            input.focus();
            for (let i = 0; i < keyLayout.length; i++) { //смена вида символов
              if (typeof keyLayout[i] !== "string") {
                keyLayout[i].reverse();
                for (const key of this.elements.keys) {
                  if (key.textContent === keyLayout[i][1]) {
                    key.textContent = keyLayout[i][0];
                  }
                }
              }
            }
            document.querySelector(".right").addEventListener("click", (event) => {
              if (!this.properties.shift) {
                input.setSelectionRange(this.properties.start = this.properties.end, this.properties.end);
                input.focus();
              } else {
                if (this.properties.direction === "none") this.properties.direction = "forward";
                if (this.properties.start <= this.properties.end && this.properties.direction === "forward") {
                  this.properties.end++;
                  if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
                } else this.properties.start++;
                if (this.properties.start === this.properties.end) this.properties.direction = "none";
                input.focus();
                input.setSelectionRange(this.properties.start, this.properties.end);
              }
            });
            document.querySelector(".left").addEventListener("click", () => {
              if (!this.properties.shift) {
                input.setSelectionRange(this.properties.start = this.properties.end, this.properties.end);
                input.value -= "←";
                input.focus();
              } else {
                if (this.properties.direction === "none") this.properties.direction = "backward";
                if (this.properties.start <= this.properties.end && this.properties.direction === "backward") {
                  this.properties.start--;
                  if (this.properties.start < 0) this.properties.start = 0;
                } else this.properties.end--;
                if (this.properties.start === this.properties.end) this.properties.direction = "none";
                input.focus();
                input.setSelectionRange(this.properties.start, this.properties.end);
              }
            });
          })
            break;

        case "ctrl":
          keyElement.classList.add("ctrl"/*, "activatable"*/);
          keyElement.innerHTML = createIconHTML("Ctrl");
          keyElement.addEventListener("click", () => {
            keyElement.classList.toggle("active");
            input.focus();
          })
          break;

        case "alt":
          keyElement.classList.add("alt"/*, "activatable"*/);
          keyElement.innerHTML = createIconHTML("Alt");
          keyElement.addEventListener("click", () => {
            keyElement.classList.toggle("active");
            input.focus();
          })
          break;
  
        case "space":
          keyElement.classList.add("space");
          keyElement.innerHTML = createIconHTML("Space");
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.start) + " " + this.properties.value.substring(this.properties.end, this.properties.value.length);
            this.properties.start++;
            this.properties.end++;
            this._triggerEvent("oninput");
            input.focus();
            let range = this.properties.end - this.properties.start;
            input.setSelectionRange(this.properties.end - range, this.properties.end - range);
            if (range > 0) {
              this.properties.end -= range;
            }
          });
          break;
  
        case "en":
          keyElement.innerHTML = "en";
          keyElement.classList.add("lang", "en");
          keyElement.innerHTML = createIconHTML("Lang");
          keyElement.addEventListener("click", () => {
            this.properties.language = !this.properties.language;
            while (this.elements.keysContainer.children.length > 0) this.elements.keysContainer.children[0].remove();
            this.elements.keysContainer.appendChild(this._createKeys());
            this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__table-key");
          });
          break;
  
        case "ru":
          keyElement.innerHTML = "ru";
          keyElement.classList.add("lang", "ru");
          keyElement.innerHTML = createIconHTML("Язык");
          keyElement.addEventListener("click", () => {
            this.properties.language = !this.properties.language;
            while (this.elements.keysContainer.children.length > 0) this.elements.keysContainer.children[0].remove();
            this.elements.keysContainer.appendChild(this._createKeys());
            this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__table-key");
          });
          break;
  
        case "left":
          keyElement.classList.add("left");
          keyElement.innerHTML = createIconHTML("Left");
          keyElement.addEventListener("click", () => {
            /*if (!this.properties.shift) {
              this.properties.start--;
              this.properties.end--;
              if (this.properties.start < 0) this.properties.start = 0;
              if (this.properties.end < 0) this.properties.end = 0;
              input.setSelectionRange(this.properties.start, this.properties.end);
            }*/
            if (!this.properties.shift === true) {
              input.value += "←";
            }
            input.focus();
          });
          break;

        case "right":
          keyElement.classList.add("right");
          keyElement.innerHTML = createIconHTML("Right");
          keyElement.addEventListener("click", () => {
            /*if (!this.properties.shift) {
              this.properties.start++;
              this.properties.end++;
              if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
              if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
              input.setSelectionRange(this.properties.start, this.properties.end);
            }*/
            if (!this.properties.shift === true) {
              input.value += "→";
            }
            input.focus();
          });
          break;

        case "pgUp":
          keyElement.classList.add("up");
          keyElement.innerHTML = createIconHTML("PgUp");
          keyElement.addEventListener("click", () => {
            input.value += "↑";
            input.focus();
          });
          break;

        case "pgDn":
          keyElement.classList.add("down");
          keyElement.innerHTML = createIconHTML("PgDn");
          keyElement.addEventListener("click", () => {
            input.value += "↓";
            input.focus();
          });
          break;

        case "empty":
          keyElement.classList.add("empty");
          break;

        default:
          if (typeof key === "string") {
            if (this.properties.capsLock || this.properties.shift)
              keyElement.textContent = key.toUpperCase();
            else keyElement.textContent = key.toLowerCase();
            if (this.properties.capsLock && this.properties.shift)
              keyElement.textContent = key.toLowerCase();
          }
          if (typeof key !== "string") keyElement.textContent = key[0];

          keyElement.addEventListener("click", () => {
            let symbol = key;
            if (typeof symbol !== "string") symbol = symbol[0];
            if (this.properties.capsLock || this.properties.shift) symbol = symbol.toUpperCase();
            else symbol = symbol.toLowerCase();
            if (this.properties.capsLock && this.properties.shift) symbol = symbol.toLowerCase();
            this.properties.value = this.properties.value.substring(0, this.properties.start) + symbol + this.properties.value.substring(this.properties.end, this.properties.value.length);

            let range = this.properties.end - this.properties.start;
            if (range > 0) {
              this.properties.end -= range;
            }
            this.properties.start++;
            this.properties.end++;
            this._triggerEvent("oninput");
            input.focus();
            input.setSelectionRange(this.properties.start, this.properties.end);
          });
          break;
      }

      nextLine.appendChild(keyElement);

      if (insertLineBreak) {
        nextLine.appendChild(document.createElement("br"));
      }
    });
    localStorage.setItem("language", keyLayout.value);
    localStorage.setItem("languageKeys", keyLayout);
    return nextLine;
    
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _functionCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && key.textContent !== "shift") {
        if (this.properties.capsLock || this.properties.shift) key.textContent = key.textContent.toUpperCase();
        else key.textContent = key.textContent.toLowerCase();
        if (this.properties.capsLock && this.properties.shift) key.textContent = key.textContent.toLowerCase();
      }
    }

  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.keysContainer.classList.remove("hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.keysContainer.classList.add("hidden");
  },

};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
