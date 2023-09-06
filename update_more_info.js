const Name = "Update more-info";
const Version = "20230906";
const Description = "standalone";
const Url = "https://github.com/Mariusthvdb/custom-ui";

// Log information about the custom-ui component
console.info(
  `%c  ${Name}  \n%c  Version ${Version} ${Description}`,
  "color: gold; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: steelblue"
);

// Update the more-info dialog to hide certain attributes based on custom logic
function updateMoreInfo(ev) {
  if (!ev.detail.expanded) return;
  const moreInfoInfo = document
    .querySelector("home-assistant")
    .shadowRoot.querySelector("ha-more-info-dialog")
    .shadowRoot.querySelector("ha-dialog")
    .getElementsByClassName("content")[0]
    .querySelector("ha-more-info-info");

  try {
    let t;
    {
      let moreInfoNodeName;
      const contentChild = moreInfoInfo.shadowRoot.querySelector(
        "more-info-content"
      ).childNodes;
      for (const nodeItem of contentChild) {
        if (nodeItem.nodeName.toLowerCase().startsWith("more-info-")) {
          moreInfoNodeName = nodeItem.nodeName.toLowerCase();
          break;
        }
      }
      if (moreInfoNodeName == "more-info-group") {
        let moreInfoNestedNodeName;
        const contentChildNested =
          moreInfoInfo.shadowRoot
            .querySelector("more-info-group")
            .shadowRoot.childNodes;
        for (const nodeItemNested of contentChildNested) {
          if (
            nodeItemNested.nodeName.toLowerCase().startsWith("more-info-")
          ) {
            moreInfoNestedNodeName = nodeItemNested.nodeName.toLowerCase();
            break;
          }
        }
        t = moreInfoInfo.shadowRoot
          .querySelector("more-info-group")
          .shadowRoot.querySelector(moreInfoNestedNodeName)
          .shadowRoot.querySelector("ha-attributes")
          .shadowRoot.querySelectorAll(".data-entry");
      } else {
        t = moreInfoInfo.shadowRoot
          .querySelector(moreInfoNodeName)
          .shadowRoot.querySelector("ha-attributes")
          .shadowRoot.querySelectorAll(".data-entry");
      }
    }
    if (t.length) {
      let e;
      for (const node of t) {
        const o = node.getElementsByClassName("key")[0];
        // make compatible for both 2023.8 and 2023.9
          if (o.innerText.toLowerCase().trim() == "hide attributes") {
              const valueContainer = o.parentNode.getElementsByClassName("value")[0];
              const haAttributeValue = valueContainer.querySelector('ha-attribute-value');
              const text = haAttributeValue
                  ? haAttributeValue.shadowRoot.textContent
                  : valueContainer.innerText;
              e = text
                  .split(",")
                  .map((item) => item.replace("_", " ").trim());
              e.push("hide attributes");
          }
      }
      for (const node of t) {
        const o = node.getElementsByClassName("key")[0];
        if (
          e.includes(o.innerText.toLowerCase().trim()) ||
          e.includes("all")
        ) {
          o.parentNode.style.display = "none";
        }
      }
    }
  } catch (err) {}
}

window.addEventListener("expanded-changed", updateMoreInfo);

