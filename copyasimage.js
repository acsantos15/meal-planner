// ===== CAPTURE AND COPY AS IMAGE =====
function tightenListSpacing(listEl) {
    listEl.style.width = "fit-content";
    listEl.style.padding = "0";
    listEl.style.margin = "0";

    listEl.querySelectorAll("li").forEach(li => {
        // kill inherited layout
        li.style.display = "inline-grid";
        li.style.gridTemplateColumns = "auto auto";
        li.style.columnGap = "6px"; // ? VERY close
        li.style.justifyContent = "start";
        li.style.width = "fit-content";
        li.style.maxWidth = "none";
        li.style.padding = "2px 0";
        li.style.margin = "0";
    });
}

async function captureAndCopy() {
    try {
        showToast("Capturing image...");
        
        // Create a container for screenshot
        const screenshotContainer = document.createElement("div");
        screenshotContainer.style.position = "fixed";
        screenshotContainer.style.top = "0";
        screenshotContainer.style.left = "0";
        screenshotContainer.style.width = "1400px";
        screenshotContainer.style.backgroundColor = "white";
        screenshotContainer.style.padding = "20px";
        screenshotContainer.style.zIndex = "-9999";
        screenshotContainer.style.overflow = "visible";

        // Style for titles
        const titleStyle = {
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "15px",
            marginTop: "0px",
            color: "#333"
        };

        // Common style for the bordered sections
        const sectionStyle = {
            border: "2px solid purple",
            borderRadius: "12px",
            padding: "15px",
            marginRight: "10px"
        };


        // MEAL TABLE Section
        const mealDiv = document.createElement("div");
        const mealTitle = document.createElement("h2");
        mealTitle.textContent = "MEAL TABLE";
        Object.assign(mealTitle.style, titleStyle);
        mealDiv.appendChild(mealTitle);
        
        const mealTableClone = document.getElementById("mealTable").cloneNode(true);
        mealTableClone.style.marginBottom = "30px";
        mealDiv.appendChild(mealTableClone);

        // CONTRIBUTIONS Section
        const contribDiv = document.createElement("div");
        const contribTitle = document.createElement("h2");
        contribTitle.textContent = "CONTRIBUTIONS";
        Object.assign(contribTitle.style, titleStyle);
        contribDiv.appendChild(contribTitle);
        
        const contribList = document.getElementById("contributionsList").cloneNode(true);
        contribList.style.marginBottom = "30px";
        contribDiv.appendChild(contribList);

        // BREAKDOWN Section
        const breakdownDiv = document.createElement("div");
        const breakdownTitle = document.createElement("h2");
        breakdownTitle.textContent = "BREAKDOWN (Amount Owed)";
        Object.assign(breakdownTitle.style, titleStyle);
        breakdownDiv.appendChild(breakdownTitle);
        
        const breakdownList = document.getElementById("amountOwedList").cloneNode(true);
        breakdownList.style.marginBottom = "30px";
        breakdownDiv.appendChild(breakdownList);

        // SETTLEMENT Section
        const settlementDiv = document.createElement("div");
        const settlementTitle = document.createElement("h2");
        settlementTitle.textContent = "SETTLEMENT";
        Object.assign(settlementTitle.style, titleStyle);
        settlementDiv.appendChild(settlementTitle);
        
        const settlementResult = document.getElementById("paymentResult").cloneNode(true);
        settlementDiv.appendChild(settlementResult);


        // Apply to each section
        Object.assign(contribDiv.style, sectionStyle);
        Object.assign(breakdownDiv.style, sectionStyle);
        Object.assign(settlementDiv.style, sectionStyle);

        const horizontalContainer = document.createElement("div");
        horizontalContainer.style.display = "flex";
        horizontalContainer.style.justifyContent = "flex-start";
        horizontalContainer.style.alignItems = "flex-start";
        horizontalContainer.style.gap = "10px";

        horizontalContainer.appendChild(contribDiv);
        horizontalContainer.appendChild(breakdownDiv);
        horizontalContainer.appendChild(settlementDiv);

        screenshotContainer.appendChild(mealDiv);
        screenshotContainer.appendChild(horizontalContainer);

        document.body.appendChild(screenshotContainer);

        // Capture the container as image
        const canvas = await html2canvas(screenshotContainer, {
            backgroundColor: "white",
            scale: 2,
            logging: false,
            useCORS: true
        });

        // Remove the container
        document.body.removeChild(screenshotContainer);

        // Convert canvas to blob and copy to clipboard
        canvas.toBlob(blob => {
            navigator.clipboard.write([
                new ClipboardItem({
                    "image/png": blob
                })
            ]).then(() => {
                showToast("âœ? Image copied to clipboard!");
            }).catch(err => {
                showToast("Failed to copy image: " + err.message);
            });
        });
    } catch (error) {
        showToast("Error: " + error.message);
        console.error("Capture error:", error);
    }
}
// ===== CAPTURE AND COPY AS IMAGE =====
