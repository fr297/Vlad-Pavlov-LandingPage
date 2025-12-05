"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Инициализация EmailJS
  emailjs.init("b3rM7F_aqAivTbSxN"); // твой Public Key

  // ====== TOAST UI (общий для всех форм) ======

  const toastEl = document.getElementById("form-toast");

  function showToast(message, type = "success") {
    if (!toastEl) {
      console.warn('Toast element with id="form-toast" not found');
      return;
    }

    toastEl.textContent = message;
    toastEl.classList.remove(
      "form-toast--success",
      "form-toast--error",
      "form-toast--visible"
    );

    if (type === "success") {
      toastEl.classList.add("form-toast--success");
    } else if (type === "error") {
      toastEl.classList.add("form-toast--error");
    }

    requestAnimationFrame(() => {
      toastEl.classList.add("form-toast--visible");
    });

    setTimeout(() => {
      toastEl.classList.remove("form-toast--visible");
    }, 3000);
  }

  // ====== Общие хелперы валидации ======

  function showError(input) {
    if (!input) return;
    input.classList.add("invalid");
    input.classList.remove("valid");
  }

  function showSuccess(input) {
    if (!input) return;
    input.classList.add("valid");
    input.classList.remove("invalid");
  }

  function checkEmail(input) {
    if (!input) return;

    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test(input.value.trim())) {
      showSuccess(input);
    } else {
      showError(input);
    }
  }

  function checkRequired(inputs) {
    inputs.forEach(function (input) {
      if (!input) return;

      if (input.value.trim() === "") {
        showError(input);
      } else {
        showSuccess(input);
      }
    });
  }

  function checkValidityForm(inputs) {
    return inputs.every((el) => el && el.classList.contains("valid"));
  }

  // ====== Универсальная настройка формы ======

  function setupForm(config) {
    const { formId, nameId, emailId, phoneId, policyId } = config;

    const form = document.getElementById(formId);
    if (!form) {
      console.warn(`Форма з id='${formId}' не знайдена`);
      return;
    }

    const username = form.querySelector("#" + nameId);
    const email = form.querySelector("#" + emailId);
    const phone = form.querySelector("#" + phoneId);
    const policyCheckbox = policyId ? form.querySelector("#" + policyId) : null;
    const policyLabel = policyId
      ? form.querySelector(`label[for="${policyId}"]`)
      : null;
    const submitBtn = form.querySelector('button[type="submit"]');

    let isSubmitting = false;

    // Live-валидация
    if (username) {
      username.addEventListener("change", function () {
        if (username.value.trim() === "") {
          showError(username);
        } else {
          showSuccess(username);
        }
      });
    }

    if (email) {
      email.addEventListener("change", function () {
        checkEmail(email);
      });
    }

    if (phone) {
      phone.addEventListener("change", function () {
        if (phone.value.trim() === "") {
          showError(phone);
        } else {
          showSuccess(phone);
        }
      });
    }

    // Хелпер для кнопки
    function setSubmitting(state) {
      isSubmitting = state;

      if (!submitBtn) return;

      if (state) {
        submitBtn.disabled = true;
        submitBtn.classList.add("start-btn--loading");

        if (!submitBtn.dataset.originalText) {
          submitBtn.dataset.originalText = submitBtn.textContent;
        }
        submitBtn.textContent = "Sending…";
      } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove("start-btn--loading");

        if (submitBtn.dataset.originalText) {
          submitBtn.textContent = submitBtn.dataset.originalText;
        }
      }
    }

    // Сабмит формы
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      const requiredFields = [username, email, phone];

      checkRequired(requiredFields);
      checkEmail(email);

      if (!checkValidityForm(requiredFields)) {
        showToast("Please fill in the fields correctly.", "error");
        return;
      }

      if (policyCheckbox && !policyCheckbox.checked) {
        if (policyLabel) {
          policyLabel.classList.add("invalid");
        }
        showToast(
          "To submit the form, you must agree to the processing of personal data.",
          "error"
        );
        return;
      } else if (policyLabel) {
        policyLabel.classList.remove("invalid");
      }

      setSubmitting(true);

      if (username && username.value.trim() !== "") {
        username.value = `${username.value}  (LANG: English)`;
      }

      emailjs
        .sendForm("service_op5a0tm", "template_vyljcpk", form)
        .then(() => {
          showToast("Message sent successfully ✅", "success");

          form.reset();

          requiredFields.forEach((input) => {
            if (!input) return;
            input.classList.remove("valid", "invalid");
          });

          if (policyCheckbox) {
            policyCheckbox.checked = false;
          }
          if (policyLabel) {
            policyLabel.classList.remove("invalid");
          }
        })
        .catch((error) => {
          console.error("EmailJS ERROR:", error);
          showToast(
            "An error occurred while sending the message. Please try again later.",
            "error"
          );
        })
        .finally(() => {
          setSubmitting(false);
        });
    });
  }

  // ====== ИНИЦИАЛИЗАЦИЯ ДВУХ ФОРМ ======

  // Основная форма
  setupForm({
    formId: "contact-form",
    nameId: "name",
    emailId: "email",
    phoneId: "phone",
    policyId: "contact-policy",
  });

  // Попап-форма
  setupForm({
    formId: "popup-form",
    nameId: "modal-name",
    emailId: "modal-email",
    phoneId: "modal-phone",
    policyId: "modal-contact-policy",
  });
});
