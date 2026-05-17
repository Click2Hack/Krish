const plans = {
  pro: "Lekh Pro",
};

const storeUrl = "https://apps.microsoft.com/detail/9NMQ1885JVXW?hl=en-us&gl=IN&ocid=pdpshare";

const showcaseScreens = {
  billing: {
    image: "assets/bill_screen.png",
    label: "Main billing page",
    title: "Make bills in a simple way.",
    text: "The billing page is clean and easy to follow, so shop owners and staff can start quickly.",
    alt: "Lekh bill making screen",
  },
  quotation: {
    image: "assets/quotation_screen.png",
    label: "Quotation page",
    title: "Create quotations easily.",
    text: "Make and share quotations from the same app without extra confusion.",
    alt: "Lekh quotation screen",
  },
  inventory: {
    image: "assets/inventory_management.png",
    label: "Inventory page",
    title: "Manage stock easily.",
    text: "Keep products and stock details in one place with a clear view.",
    alt: "Lekh inventory management screen",
  },
  customers: {
    image: "assets/customer_management.png",
    label: "Customer page",
    title: "Keep customer details safely.",
    text: "Customer history and due amounts stay easy to check when needed.",
    alt: "Lekh customer management screen",
  },
  templates: {
    image: "assets/pdf_templates.png",
    label: "Bill design page",
    title: "Choose bill designs easily.",
    text: "Use bill styles that match your business and keep invoices looking professional.",
    alt: "Lekh bill design templates screen",
  },
  dashboard: {
    image: "assets/dashboard.png",
    label: "Dashboard page",
    title: "See business details clearly.",
    text: "Use the dashboard to quickly view business activity in one place.",
    alt: "Lekh dashboard screen",
  },
};

function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");
    const isLight = document.documentElement.classList.contains("light");
    localStorage.setItem("lekh-theme", isLight ? "light" : "dark");
  });
}

function trackEvent(name, params) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params || {});
}

function initMobileMenu() {
  const button = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    button.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      button.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

function initHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

function initShowcase() {
  const tabs = document.querySelectorAll(".showcase-tab");
  const image = document.getElementById("showcase-image");
  const label = document.getElementById("showcase-label");
  const title = document.getElementById("showcase-title");
  const text = document.getElementById("showcase-text");

  if (!tabs.length || !image || !label || !title || !text) return;

  const updateScreen = (key) => {
    const screen = showcaseScreens[key];
    if (!screen) return;

    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.getAttribute("data-screen") === key);
    });

    image.classList.add("is-switching");

    window.setTimeout(() => {
      image.setAttribute("src", screen.image);
      image.setAttribute("alt", screen.alt);
      label.textContent = screen.label;
      title.textContent = screen.title;
      text.textContent = screen.text;
      image.classList.remove("is-switching");
    }, 100);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-screen");
      if (key) updateScreen(key);
    });
  });
}

function buildWhatsAppUrl(planKey) {
  const plan = plans[planKey] || "Lekh";
  const text = encodeURIComponent(
    "Hi, I want to buy " + plan + " for my business. Please share the next steps."
  );
  return "https://wa.me/918277903282?text=" + text;
}

function buildEmailUrl(planKey) {
  const plan = plans[planKey] || "Lekh";
  const subject = encodeURIComponent("Lekh inquiry - " + plan);
  const body = encodeURIComponent(
    "Hi,\n\nI am interested in " + plan + ". Please share pricing, activation, and support details.\n"
  );
  return "mailto:lekh.hq@gmail.com?subject=" + subject + "&body=" + body;
}

function initDirectContactLinks() {
  const links = document.querySelectorAll("[data-plan][data-channel]");
  if (!links.length) return;

  links.forEach((link) => {
    const plan = link.getAttribute("data-plan");
    const channel = link.getAttribute("data-channel");
    if (!plan || !channel) return;

    const href = channel === "email" ? buildEmailUrl(plan) : buildWhatsAppUrl(plan);
    link.setAttribute("href", href);

    if (channel === "whatsapp") {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    }

    link.addEventListener("click", () => {
      trackEvent("contact_click", {
        channel: channel,
        plan: plan,
      });
    });
  });
}

function showStoreToast() {
  const toast = document.getElementById("download-toast");
  const pricing = document.getElementById("pricing");
  if (!toast) return;

  toast.classList.add("is-visible");
  if (pricing) {
    pricing.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 6000);
}

function startStoreFlow(source) {
  trackEvent("store_open_click", {
    source: source || "website",
  });

  showStoreToast();
  window.location.href = storeUrl;
}

function initStoreFlow() {
  const heroTrigger = document.getElementById("hero-download-trigger");
  const storeLinks = document.querySelectorAll("[data-store-flow='true']");

  if (heroTrigger) {
    heroTrigger.addEventListener("click", () => {
      startStoreFlow("hero_title");
    });
  }

  storeLinks.forEach((link) => {
    link.setAttribute("href", storeUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
    link.addEventListener("click", (event) => {
      trackEvent("store_open_click", {
        source: "store_button",
      });
      showStoreToast();
    });
  });
}

function initNavSpy() {
  const links = document.querySelectorAll(".nav-links a, .mobile-menu a");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileMenu();
  initHeaderState();
  initReveal();
  initShowcase();
  initDirectContactLinks();
  initStoreFlow();
  initNavSpy();
});
