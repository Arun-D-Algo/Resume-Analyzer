const emailSection = document.getElementById("emailSection");
const emailInput = document.getElementById("emailInput");
const emailBtn = document.getElementById("emailBtn");
const chooseBtn = document.getElementById("chooseBtn");
const resumeInput = document.getElementById("resumeInput");
const selectedFile = document.getElementById("selectedFile");
const dropZone = document.getElementById("dropZone");

const analyzeBtn = document.getElementById("analyzeBtn");

const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

const welcomeCard = document.getElementById("welcomeCard");
const results = document.getElementById("results");

const scoreValue = document.getElementById("scoreValue");
const progressFill = document.getElementById("progressFill");

const strengthList = document.getElementById("strengthList");
const weaknessList = document.getElementById("weaknessList");
const suggestionList = document.getElementById("suggestionList");

const processingTime = document.getElementById("processingTime");

const toast = document.getElementById("toast");

const jobDescription = document.getElementById("jobDescription");

let selectedResume = null;
let latestAnalysis = null;

const API_URL = "https://resume-analyzer-14e7.onrender.com/analyze";

chooseBtn.addEventListener("click", () => {

    resumeInput.click();

});

resumeInput.addEventListener("change", () => {

    if (!resumeInput.files.length) return;

    selectedResume = resumeInput.files[0];

    selectedFile.textContent = selectedResume.name;

});


dropZone.addEventListener("click", (e) => {

    if (e.target === chooseBtn) return;

    resumeInput.click();

});

["dragenter", "dragover"].forEach(eventName => {

    dropZone.addEventListener(eventName, (e) => {

        e.preventDefault();
        e.stopPropagation();

        dropZone.classList.add("drag-over");

    });

});

["dragleave", "drop"].forEach(eventName => {

    dropZone.addEventListener(eventName, (e) => {

        e.preventDefault();
        e.stopPropagation();

        dropZone.classList.remove("drag-over");

    });

});

dropZone.addEventListener("drop", (e) => {

    const files = e.dataTransfer.files;

    if (!files.length) return;

    const file = files[0];

    if (file.type !== "application/pdf") {

        showToast("Please drop a PDF file.");

        return;

    }

    selectedResume = file;

    selectedFile.textContent = file.name;

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    resumeInput.files = dataTransfer.files;

});

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

function showLoading(){

    loadingOverlay.classList.remove("hidden");

}

function hideLoading(){

    loadingOverlay.classList.add("hidden");

}

function animateScore(score){

    let current = 0;

    const interval = setInterval(()=>{

        current++;

        scoreValue.textContent = current;

        progressFill.style.width = current + "%";

        if(current>=score){

            clearInterval(interval);

        }

    },15);

}
analyzeBtn.addEventListener("click", async () => {

    if (!selectedResume) {
        showToast("Please choose a PDF resume.");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...`;

    showLoading();

    const loadingSteps = [
        "Uploading Resume...",
        "Reading PDF...",
        "Talking to Gemini...",
        "Generating AI Report..."
    ];

    let step = 0;

    loadingText.textContent = loadingSteps[0];

    const loadingInterval = setInterval(() => {

        step++;

        if (step < loadingSteps.length) {
            loadingText.textContent = loadingSteps[step];
        }

    }, 1200);

    try {

        const formData = new FormData();

        formData.append("file", selectedResume);

        formData.append(
            "job_description",
            jobDescription.value
        );

        const response = await fetch(API_URL, {

            method: "POST",

            body: formData

        });

        clearInterval(loadingInterval);

        hideLoading();

        analyzeBtn.disabled = false;

        analyzeBtn.innerHTML =
            `<i class="fa-solid fa-magnifying-glass"></i> Analyze Resume`;

        if (!response.ok) {

            const error = await response.json();

            throw new Error(error.detail);

        }

        const data = await response.json();

        latestAnalysis = data;

        welcomeCard.classList.add("hidden");

        results.classList.remove("hidden");

        emailSection.classList.remove("hidden");

        animateScore(data.score);

        processingTime.textContent =
            `Processed in ${data.processing_time} seconds`;

        strengthList.innerHTML = "";

        weaknessList.innerHTML = "";

        suggestionList.innerHTML = "";

        data.strengths.forEach(item => {

            strengthList.innerHTML +=
                `<li>${item}</li>`;

        });

        data.weaknesses.forEach(item => {

            weaknessList.innerHTML +=
                `<li>${item}</li>`;

        });

        data.suggestions.forEach(item => {

            suggestionList.innerHTML +=
                `<li>${item}</li>`;

        });

    }

    catch(error){

        clearInterval(loadingInterval);

        hideLoading();

        analyzeBtn.disabled = false;

        analyzeBtn.innerHTML =
            `<i class="fa-solid fa-magnifying-glass"></i> Analyze Resume`;

        showToast(error.message);

        console.error(error);

    }

});

emailBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();

    if (!email) {

        showToast("Please enter your email address.");

        return;

    }

    if (!latestAnalysis) {

        showToast("Analyze a resume first.");

        return;

    }

    emailBtn.disabled = true;

    emailBtn.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

    try {

        const response = await fetch(

            "https://resume-analyzer-14e7.onrender.com/send-email",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: email,

                    filename: selectedResume.name,

                    score: latestAnalysis.score,

                    processing_time: latestAnalysis.processing_time,

                    strengths: latestAnalysis.strengths,

                    weaknesses: latestAnalysis.weaknesses,

                    suggestions: latestAnalysis.suggestions

                })

            }

        );

        if (!response.ok) {

            const err = await response.json();

            throw new Error(err.detail);

        }

        showToast("Email sent successfully!");
        emailInput.value = "";

    }

    catch(error){

        console.error(error);

        showToast(error.message);

    }

    emailBtn.disabled = false;

    emailBtn.innerHTML =
        `<i class="fa-solid fa-paper-plane"></i> Email Report`;

});