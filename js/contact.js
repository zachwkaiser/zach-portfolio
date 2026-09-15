/** Contact form validation + Resend delivery via /api/contact */

export function initContact() {
  const form = document.getElementById("zk-contact-form");
  const success = document.getElementById("zk-form-success");
  const resetBtn = document.getElementById("zk-form-reset");
  const submitBtn = form?.querySelector('[type="submit"]');
  const formError = document.getElementById("zk-form-error");
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
  const idleLabel = submitBtn?.textContent || "Send message";

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

  function setFormError(msg) {
    if (!formError) return;
    if (msg) {
      formError.textContent = msg;
      formError.classList.add("is-visible");
    } else {
      formError.textContent = "";
      formError.classList.remove("is-visible");
    }
  }

  function setSending(isSending) {
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.textContent = isSending ? "Sending…" : idleLabel;
  }

  Object.keys(fields).forEach((key) => {
    const input = fields[key];
    if (!input) return;
    input.addEventListener("input", () => {
      if (touched[key]) showError(key, validate(key, input.value));
      setFormError("");
    });
    input.addEventListener("blur", () => {
      touched[key] = true;
      showError(key, validate(key, input.value));
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setFormError("");

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim(),
    };

    const msgs = {
      name: validate("name", payload.name),
      email: validate("email", payload.email),
      message: validate("message", payload.message),
    };

    touched.name = touched.email = touched.message = true;
    showError("name", msgs.name);
    showError("email", msgs.email);
    showError("message", msgs.message);
    if (msgs.name || msgs.email || msgs.message) return;

    setSending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          data.error ||
            "Could not send your message. Please try again or email me directly."
        );
        return;
      }

      const first = payload.name.split(" ")[0];
      const nameEl = document.getElementById("zk-sent-name");
      if (nameEl) nameEl.textContent = first;

      form.classList.add("is-hidden");
      success?.classList.remove("is-hidden");
    } catch (_) {
      setFormError(
        "Could not send your message. Please try again or email me directly."
      );
    } finally {
      setSending(false);
    }
  });

  resetBtn?.addEventListener("click", () => {
    form.reset();
    Object.keys(fields).forEach((k) => {
      touched[k] = false;
      showError(k, "");
    });
    setFormError("");
    success?.classList.add("is-hidden");
    form.classList.remove("is-hidden");
  });
}
