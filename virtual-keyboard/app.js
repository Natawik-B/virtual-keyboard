let input = document.querySelector('.keyboard__text-area');

const Keyboard = {
  elements: {
    main: null,
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

    this.elements.keysContainer = document.createElement("div");
    this.elements.keysContainer.classList.add("keyboard__table-keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__table-key");

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    this.elements.tableArea = document.createElement("div");
    this.elements.tableArea.classList.add("keyboard__text-area");

    //Auto use keyboard for element with class .keyboard__text-area
    document.querySelectorAll(".keyboard__text-area").forEach(el => {
      el.addEventListener("focus", () => {
        this.open(el.value, currentValue => {
          el.value = currentValue;
        });
      });

      el.addEventListener("click", () => {
        this.properties.start = input.selectionStart;
        this.properties.end = input.selectionEnd;
      });
      el.addEventListener("keypress", key => {
        this.properties.value += key.key;
        this.open(el.value, currentValue => {
          if (this.properties.start > el.value.length) {
            el.value += currentValue.substring(currentValue.length - 1, currentValue.length);
          } else {
            el.value = el.value.substring(0, this.properties.start - 1) +
              currentValue.substring(this.properties.start - 1, this.properties.end) +
              el.value.substring(this.properties.end - 1, el.value.length);
          }
        });
        this.properties.start++;
        this.properties.end++;
      });
      el.addEventListener("keydown", key => {
        if (key.which === 37) {
          this.properties.start--;
          this.properties.end--;
          if (this.properties.start < 0) this.properties.start = 0;
          if (this.properties.end < 0) this.properties.end = 0;
        }
        if (key.which === 39) {
          this.properties.start++;
          this.properties.end++;
          if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
          if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
        }
      });
    });
  },

  _createKeys() {
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
      "win",
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
      "win",
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

    let keyLayout;

    if (this.properties.language) keyLayout = enKey;
    else keyLayout = ruKey;
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
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
            input.focus();
          });
          break;

        case "delete":
          keyElement.classList.add("delete");
          keyElement.innerHTML = createIconHTML("Delete");
          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
            input.focus();
          });
          break;

        case "caps":
          keyElement.classList.add("caps", "activatable");
          keyElement.innerHTML = createIconHTML("CapsLock");
          if (this.properties.capsLock === true) keyElement.classList.toggle("shift");
          keyElement.addEventListener("click", () => {
            this._functionCapsLock();
            keyElement.classList.toggle("active", this.properties.capsLock);
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
              for (let i = 0; i < keyLayout.length; i++) { //смена регистра букв и символов
                if (typeof keyLayout[i] !== "string") { //смена символов
                  keyLayout[i].reverse();
                  for (const key of this.elements.keys) {
                    if (key.textContent === keyLayout[i][1]) {
                      key.textContent = keyLayout[i][0];
                    }
                  }
                }
              }
              for (const key of this.elements.keys) {
                if (key.childElementCount === 0 && key.textContent !== "shift") {
                  if (this.properties.capsLock || this.properties.shift) key.textContent = key.textContent.toUpperCase();
                  else key.textContent = key.textContent.toLowerCase();
                  if (this.properties.capsLock && this.properties.shift) key.textContent = key.textContent.toLowerCase();
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
            if (!this.properties.shift) {
              this.properties.start--;
              this.properties.end--;
              if (this.properties.start < 0) this.properties.start = 0;
              if (this.properties.end < 0) this.properties.end = 0;
              input.setSelectionRange(this.properties.start, this.properties.end);
            }
            input.focus();
          });
          break;

        case "right":
          keyElement.classList.add("right");
          keyElement.innerHTML = createIconHTML("Right");
          keyElement.addEventListener("click", () => {
            if (!this.properties.shift) {
              this.properties.start++;
              this.properties.end++;
              if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
              if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
              input.setSelectionRange(this.properties.start, this.properties.end);
            }
            input.focus();
          });
          break;

        case "pgUp":
          keyElement.classList.add("up");
          keyElement.innerHTML = createIconHTML("PgUp");
          keyElement.addEventListener("click", () => {
            if (!this.properties.shift) {
              this.properties.start--;
              this.properties.end--;
  
              if (this.properties.start < 0) this.properties.start = 0;
              if (this.properties.end < 0) this.properties.end = 0;
              input.setSelectionRange(this.properties.start, this.properties.end);
            }
            input.focus();
          });
          break;

        case "pgDn":
          keyElement.classList.add("down");
          keyElement.innerHTML = createIconHTML("PgDn");
          keyElement.addEventListener("click", () => {
            if (!this.properties.shift) {
              this.properties.start--;
              this.properties.end--;
              if (this.properties.start < 0) this.properties.start = 0;
              if (this.properties.end < 0) this.properties.end = 0;
              input.setSelectionRange(this.properties.start, this.properties.end);
            }
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

};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});
