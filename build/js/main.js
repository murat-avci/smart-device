const KEYCODE = {
  esc: 27,
};
const link = document.querySelector(".page-header__contacts-button");
const popup = document.querySelector(".modal");
const popupClose = document.querySelector(".modal__close");
const form = document.querySelector(".modal__form");
const userName = document.querySelector("#username");
const phone = document.querySelector("#call-phone");
const askPhone = document.querySelector("#ask-us-phone");
const phoneInputs = document.querySelectorAll('input[type^="tel"]');
const message = document.querySelector("#call-question");
let isStorageSupport = true;
let storage = {};

const openPopup = function () {
  popup.classList.add("modal--show");
  document.body.classList.add("disable-scroll");
};

const closePopup = function () {
  popup.classList.remove("modal--show");
  document.body.classList.remove("disable-scroll");
};

try {
  storage.name = localStorage.getItem("username");
  storage.phone = localStorage.getItem("phone");
  storage.message = localStorage.getItem("question");
} catch (err) {
  isStorageSupport = false;
}

link.addEventListener("click", function (evt) {
  evt.preventDefault();

  if (popup && form) {
    openPopup();
  }

  if (storage.name) {
    userName.value = storage.name;
    phone.value = storage.phone;
    message.value = storage.message;
    message.focus();
  } else {
    userName.focus();
  }
});

popupClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  closePopup();
});

form.addEventListener("submit", function () {
  if (isStorageSupport) {
    localStorage.setItem("name", userName.value);
    localStorage.setItem("phone", phone.value);
    localStorage.setItem("message", message.value);
  }
});

window.addEventListener("keydown", function (evt) {
  if (evt.key === KEYCODE.esc) {
    evt.preventDefault();
    if (popup.classList.contains("modal--show")) {
      closePopup();
    }
  }
});

popup.addEventListener("click", function (evt) {
  if (evt.target === popup) {
    closePopup();
  }
});

const getCorrectName = function () {
  const valueName = userName.value;
  const re = /^[a-zA-Zа-яА-Я]*$/;

  for (let i = 0; i < valueName.length; i++) {
    if (!re.test(valueName[i])) {
      userName.setCustomValidity("Имя должно содержать только буквы");
    } else {
      userName.setCustomValidity("");
    }
  }
};

userName.addEventListener("input", function () {
  getCorrectName();
});

window.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll('input[type="tel"]');
  Array.prototype.forEach.call(inputs, function (input) {
    new InputMask({
      selector: input,
      layout: input.dataset.mask,
    });
  });
});

function InputMask(options) {
  this.el = this.getElement(options.selector);
  if (!this.el) return;
  this.layout = options.layout || "+_ (___) ___-__-__";
  this.maskreg = this.getRegexp();

  this.setListeners();
}

InputMask.prototype.getRegexp = function () {
  let str = this.layout.replace(/_/g, "\\d");
  str = str.replace(/\(/g, "\\(");
  str = str.replace(/\)/g, "\\)");
  str = str.replace(/\+/g, "\\+");
  str = str.replace(/\s/g, "\\s");

  return str;
};

InputMask.prototype.mask = function (e) {
  let _this = e.target,
    matrix = this.layout,
    i = 0,
    def = matrix.replace(/\D/g, ""),
    val = _this.value.replace(/\D/g, "");

  if (def.length >= val.length) val = def;

  _this.value = matrix.replace(/./g, function (a) {
    return /[_\d]/.test(a) && i < val.length
      ? val.charAt(i++)
      : i >= val.length
      ? ""
      : a;
  });

  if (e.type == "blur") {
    const regexp = new RegExp(this.maskreg);
    if (!regexp.test(_this.value)) _this.value = "";
  } else {
    this.setCursorPosition(_this.value.length, _this);
  }
};

InputMask.prototype.setCursorPosition = function (pos, elem) {
  elem.focus();
  if (elem.setSelectionRange) elem.setSelectionRange(pos, pos);
  else if (elem.createTextRange) {
    const range = elem.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
};

InputMask.prototype.setListeners = function () {
  this.el.addEventListener("input", this.mask.bind(this), false);
  this.el.addEventListener("focus", this.mask.bind(this), true);
  this.el.addEventListener("blur", this.mask.bind(this), false);
};

InputMask.prototype.getElement = function (selector) {
  if (selector === undefined) return false;
  if (this.isElement(selector)) return selector;
  if (typeof selector === "string") {
    const el = document.querySelector(selector);
    if (this.isElement(el)) return el;
  }
  return false;
};

InputMask.prototype.isElement = function (element) {
  return element instanceof Element || element instanceof HTMLDocument;
};

function mouse(inputs) {
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      input.placeholder = "+7_ (___) ___-__-__";
    });

    input.addEventListener("mouseover", function () {
      input.placeholder = "+7_ (___) ___-__-__";
    });

    input.addEventListener("mouseout", function () {
      input.placeholder = "Телефон";
    });
  });
}

mouse(phoneInputs);

const accordionItems = document.querySelectorAll(".accordion");
const accordionPanes = document.querySelectorAll(".accordion__pane");

const hidePane = function (button, pane) {
  button.classList.add("accordion__toggle--inactive");
  pane.classList.add("accordion__pane--hidden");
};

const showPane = function (button, pane) {
  button.classList.remove("accordion__toggle--inactive");
  pane.classList.remove("accordion__pane--hidden");
};

const toggleAccordion = function (evt) {
  Array.prototype.forEach.call(accordionPanes, function (accordionPane) {
    const button = accordionPane
      .closest(".accordion")
      .querySelector(".accordion__toggle");
    if (
      (button === evt.target &&
        !button.classList.contains("accordion__toggle--inactive")) ||
      button !== evt.target
    ) {
      hidePane(button, accordionPane);
    } else if (button === evt.target) {
      showPane(button, accordionPane);
    }
  });
};

Array.prototype.forEach.call(accordionItems, function (accordion) {
  const accordionToggleButton = accordion.querySelector(".accordion__toggle");
  const accordionPane = accordion.querySelector(".accordion__pane");
  hidePane(accordionToggleButton, accordionPane);
  accordionToggleButton.addEventListener("click", toggleAccordion);
});
