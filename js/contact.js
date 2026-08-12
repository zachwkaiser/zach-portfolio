/** Contact form validation + success state */

export function initContact() {
  const form = document.getElementById("zk-contact-form");
  const success = document.getElementById("zk-form-success");
  const resetBtn = document.getElementById("zk-form-reset");
  if (!form) return;

  const fields = {
    name: form.querySelector("#zk-name"),
    email: form.querySelector("#zk-email"),
    message: form.querySelector("#zk-msg"),
  };

  const errors = {
    name: form.querySelector("#zk-name-err"),
    email: form.querySelector("#zk-email-err"),
    message: form.querySelector("#zk-msg-err"),
  };

  const touched = { name: false, email: false, message: false };

  function validate(key, value) {
    if (key === "name") return value.trim() ? "" : "Please enter your name.";
    if (key === "email")
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim())
        ? ""
        : "Enter a valid email address.";
    if (key === "message")
      return value.trim().length >= 10
        ? ""
        : "Please write at least 10 characters.";
    return "";
  }

  function showError(key, msg) {
    const input = fields[key];
    const err = errors[key];
    if (!input || !err) return;
    if (msg) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      err.textContent = msg;
      err.classList.add("is-visible");
    } else {
      input.classList.remove("is-invalid");
      input.setAttribute("aria-invalid", "false");
      err.textContent = "";
      err.classList.remove("is-visible");
    }
  }

  Object.keys(fields).forEach((key) => {
    const input = fields[key];
    if (!input) return;
    input.addEventListener("input", () => {
      if (touched[key]) showError(key, validate(key, input.value));
    });
    input.addEventListener("blur", () => {
      touched[key] = true;
      showError(key, validate(key, input.value));
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msgs = {
      name: validate("name", fields.name.value),
      email: validate("email", fields.email.value),
      message: validate("message", fields.message.value),
    };
    touched.name = touched.email = touched.message = true;
    showError("name", msgs.name);
    showError("email", msgs.email);
    showError("message", msgs.message);
    if (msgs.name || msgs.email || msgs.message) return;

    const first = fields.name.value.trim().split(" ")[0];
    const nameEl = document.getElementById("zk-sent-name");
    if (nameEl) nameEl.textContent = first;

    form.classList.add("is-hidden");
    success?.classList.remove("is-hidden");
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
    Object.keys(fields).forEach((k) => {
      touched[k] = false;
      showError(k, "");
    });
    success?.classList.add("is-hidden");
    form.classList.remove("is-hidden");
  });
}
