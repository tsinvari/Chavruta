document.addEventListener('DOMContentLoaded', () => {
    const adminTractateSelect = document.getElementById('adminTractateSelect');
    const adminPageSelect = document.getElementById('adminPageSelect');
    const adminMiriamInsights = document.getElementById('adminMiriamInsights');
    const adminYoutubeTitle = document.getElementById('adminYoutubeTitle');
    const adminYoutubeId = document.getElementById('adminYoutubeId');
    const saveAdminChangesButton = document.getElementById('saveAdminChangesButton');
    const adminAuthButton = document.getElementById('adminAuthButton');
    const adminContent = document.getElementById('adminContent');
    const adminStatusText = document.getElementById('adminStatusText');

    const loginModal = document.getElementById('loginModal');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const modalLoginButton = document.getElementById('modalLoginButton');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    const messageBox = document.getElementById('messageBox'); // For admin messages

    const LOCAL_STORAGE_KEY = 'miriamAnzovinStudyData'; // Same key as main app
    const MIRIAM_ADMIN_LOGIN_FLAG = 'miriamAdminLoggedIn'; // Flag for auto-login

    let miriamAnzovinData = {}; // Data loaded from/saved to local storage
    let isLoggedIn = false;

    // Hardcoded list of Talmudic tractates and their number of folios (dapim)
    const talmudTractatesData = {
        "Berakhot": { folios: 64 }, "Shabbat": { folios: 157 }, "Eruvin": { folios: 105 }, "Pesahim": { folios: 121 }, "Yoma": { folios: 88 },
        "Sukkah": { folios: 56 }, "Beitzah": { folios: 40 }, "Rosh Hashanah": { folios: 35 }, "Ta'anit": { folios: 31 }, "Megillah": { folios: 32 },
        "Mo'ed Katan": { folios: 29 }, "Chagigah": { folios: 27 }, "Yevamot": { folios: 122 }, "Ketubot": { folios: 112 }, "Nedarim": { folios: 91 },
        "Nazir": { folios: 66 }, "Sotah": { folios: 49 }, "Gittin": { folios: 90 }, "Kiddushin": { folios: 82 }, "Bava Kamma": { folios: 119 },
        "Bava Metzia": { folios: 119 }, "Bava Batra": { folios: 176 }, "Sanhedrin": { folios: 113 }, "Makkot": { folios: 24 },
        "Shevuot": { folios: 49 }, "Avodah Zarah": { folios: 76 }, "Horayot": { folios: 14 }, "Zevahim": { folios: 120 }, "Menahot": { folios: 110 },
        "Hullin": { folios: 142 }, "Bekhorot": { folios: 61 }, "Arakhin": { folios: 34 }, "Temurah": { folios: 34 }, "Keritot": { folios: 28 },
        "Me'ilah": { folios: 22 }, "Tamid": { folios: 33 }, "Niddah": { folios: 73 }, "Reelim": { folios: 5 }
    };

    const talmudTractatesOrder = [
        "Berakhot", "Shabbat", "Eruvin", "Pesahim", "Yoma", "Sukkah", "Beitzah",
        "Rosh Hashanah", "Ta'anit", "Megillah", "Mo'ed Katan", "Chagigah",
        "Yevamot", "Ketubot", "Nedarim", "Nazir", "Sotah", "Gittin", "Kiddushin",
        "Bava Kamma", "Bava Metzia", "Bava Batra", "Sanhedrin", "Makkot",
        "Shevuot", "Avodah Zarah", "Horayot", "Zevahim", "Menahot", "Hullin",
        "Bekhorot", "Arakhin", "Temurah", "Keritot", "Me'ilah", "Tamid", "Niddah",
        "Reelim"
    ];

    const defaultYoutubeVideoAdmin = {
        title: "Default Miriam's Daf Reactions!",
        id: "AyxpXVUy81o"
    };

    // --- Utility Functions ---
    const showMessageBox = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.className = `message-box admin show ${isError ? 'bg-red-500' : 'bg-blue-600'}`;
        setTimeout(() => {
            messageBox.className = 'message-box admin';
        }, 3000);
    };

    function generateDafNumbers(folios) {
        const dafNumbers = [];
        if (folios === 0) return dafNumbers;
        for (let i = 2; i <= folios; i++) {
            dafNumbers.push(i.toString());
        }
        return dafNumbers;
    }

    // --- Local Storage Management ---
    const initializeLocalStorageData = () => {
        console.log("admin-script.js: initializeLocalStorageData called.");
        let data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) {
            // This default data ensures the admin panel has something to load if localStorage is empty
            // It will also be populated by miriam_anzovin_videos.json in script.js on the main page.
            miriamAnzovinData = {
                videos: {
                    "Berakhot 2": { title: "Miriam Anzovin's Berakhot 2 Insight", id: "QQJZmbipbFg" }
                },
                insights: {
                    "Berakhot 2": "This is Miriam Anzovin's custom insight for Berakhot 2. Modify this text in the admin panel."
                }
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(miriamAnzovinData));
            console.log("admin-script.js: Initialized Miriam Anzovin data in Local Storage with defaults.");
        } else {
            miriamAnzovinData = JSON.parse(data);
            console.log("admin-script.js: Loaded Miriam Anzovin data from Local Storage.");
        }
        console.log("admin-script.js: Current miriamAnzovinData:", miriamAnzovinData);
    };

    const saveLocalStorageData = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(miriamAnzovinData));
        showMessageBox('Changes saved locally!');
        console.log("admin-script.js: Miriam Anzovin data saved to Local Storage:", miriamAnzovinData);
    };

    // --- Admin UI Population and Logic ---
    const populateAdminTractateSelect = () => {
        adminTractateSelect.innerHTML = '<option value="">Select Tractate</option>';
        talmudTractatesOrder.forEach(tractate => {
            const option = document.createElement('option');
            option.value = tractate;
            option.textContent = tractate;
            adminTractateSelect.appendChild(option);
        });
    };

    const populateAdminPageSelect = (tractateName) => {
        adminPageSelect.innerHTML = '<option value="">Select Daf</option>';
        adminPageSelect.disabled = true;

        if (!tractateName) {
            return;
        }

        const tractateInfo = talmudTractatesData[tractateName];
        if (tractateInfo && typeof tractateInfo.folios === 'number') {
            const dafNumbers = generateDafNumbers(tractateInfo.folios);
            dafNumbers.forEach(daf => {
                const option = document.createElement('option');
                option.value = daf;
                option.textContent = daf;
                adminPageSelect.appendChild(option);
            });
            adminPageSelect.disabled = false;
        } else {
            adminPageSelect.innerHTML = '<option value="">No Dafs Available</option>';
            adminPageSelect.disabled = true;
        }
    };

    const loadDafDataIntoForm = () => {
        const tractate = adminTractateSelect.value;
        const daf = adminPageSelect.value;
        const key = `${tractate} ${daf}`;
        console.log(`admin-script.js: Loading data for ${key}`);

        if (tractate && daf) {
            adminMiriamInsights.value = (miriamAnzovinData.insights && miriamAnzovinData.insights[key]) || "";
            const videoInfo = (miriamAnzovinData.videos && miriamAnzovinData.videos[key]);
            adminYoutubeTitle.value = videoInfo ? videoInfo.title : "";
            adminYoutubeId.value = videoInfo ? videoInfo.id : "";
            console.log(`admin-script.js: Loaded Insights: "${adminMiriamInsights.value}", Video Title: "${adminYoutubeTitle.value}"`);
        } else {
            adminMiriamInsights.value = "";
            adminYoutubeTitle.value = "";
            adminYoutubeId.value = "";
            console.log("admin-script.js: Clearing form fields.");
        }
    };

    const handleSaveAdminChanges = () => {
        const tractate = adminTractateSelect.value;
        const daf = adminPageSelect.value;
        const key = `${tractate} ${daf}`;
        console.log(`admin-script.js: Attempting to save changes for ${key}`);

        if (!tractate || !daf) {
            showMessageBox('Please select a Tractate and Daf to save changes.', true);
            console.warn("admin-script.js: Save failed: Tractate or Daf not selected.");
            return;
        }

        // Save Insights
        if (!miriamAnzovinData.insights) {
            miriamAnzovinData.insights = {};
        }
        miriamAnzovinData.insights[key] = adminMiriamInsights.value;

        // Save Video
        if (!miriamAnzovinData.videos) {
            miriamAnzovinData.videos = {};
        }
        miriamAnzovinData.videos[key] = {
            title: adminYoutubeTitle.value,
            id: adminYoutubeId.value
        };

        saveLocalStorageData();
        console.log("admin-script.js: Changes prepared for saving.");
    };

    // --- Admin Login Logic ---
    const correctAdminUsername = "miriam";
    const correctAdminPassword = "notjustacontentcreatorbutabeautifulhumanbeing";

    const showLoginModal = () => {
        loginModal.classList.add('show');
        usernameInput.value = '';
        passwordInput.value = '';
        loginErrorMessage.textContent = '';
        console.log("admin-script.js: Login modal shown.");
    };

    const hideLoginModal = () => {
        loginModal.classList.remove('show');
        console.log("admin-script.js: Login modal hidden.");
    };

    const setAdminLoggedInState = (loggedIn) => {
        isLoggedIn = loggedIn;
        if (isLoggedIn) {
            adminContent.classList.remove('hidden');
            adminAuthButton.textContent = 'Logout';
            adminAuthButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            adminAuthButton.classList.add('bg-red-600', 'hover:bg-red-700');
            adminStatusText.textContent = "Welcome, Miriam! Manage Daf Yomi content below.";
            populateAdminTractateSelect(); // Populate dropdowns after login
            if (talmudTractatesOrder.length > 0) {
                adminTractateSelect.value = "Berakhot"; // Default to Berakhot
                populateAdminPageSelect("Berakhot");
                adminPageSelect.value = "2"; // Default to Daf 2
                loadDafDataIntoForm();
            }
            console.log("admin-script.js: Admin logged in successfully. UI updated.");
        } else {
            adminContent.classList.add('hidden');
            adminAuthButton.textContent = 'Login';
            adminAuthButton.classList.remove('bg-red-600', 'hover:bg-red-700');
            adminAuthButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
            adminStatusText.textContent = "Please log in to manage content.";
            console.log("admin-script.js: Admin logged out. UI updated.");
        }
    };

    const handleAdminLogin = () => {
        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;
        console.log(`admin-script.js: Attempting admin login for username: ${enteredUsername}`);

        if (enteredUsername === correctAdminUsername && enteredPassword === correctAdminPassword) {
            hideLoginModal();
            setAdminLoggedInState(true);
            showMessageBox('Logged in as Miriam!');
            localStorage.setItem(MIRIAM_ADMIN_LOGIN_FLAG, 'true'); // Set flag on successful login
            console.log("admin-script.js: Miriam login successful. Flag set in localStorage.");
        } else {
            loginErrorMessage.textContent = 'Invalid username or password.';
            console.warn("admin-script.js: Admin login failed for", enteredUsername);
        }
    };

    const handleAdminAuthButtonClick = () => {
        if (isLoggedIn) {
            console.log("admin-script.js: Admin Auth button clicked (currently logged in), initiating logout.");
            setAdminLoggedInState(false);
            showMessageBox('Logged out from Admin Panel.');
            localStorage.removeItem(MIRIAM_ADMIN_LOGIN_FLAG); // Remove flag on logout
            console.log("admin-script.js: Miriam logged out. Flag removed from localStorage.");
        } else {
            console.log("admin-script.js: Admin Auth button clicked (currently logged out), showing login modal.");
            showLoginModal();
        }
    };

    // --- Event Listeners ---
    adminTractateSelect.addEventListener('change', () => {
        populateAdminPageSelect(adminTractateSelect.value);
        loadDafDataIntoForm();
        console.log("admin-script.js: Admin tractate changed.");
    });
    adminPageSelect.addEventListener('change', () => {
        loadDafDataIntoForm();
        console.log("admin-script.js: Admin daf changed.");
    });
    saveAdminChangesButton.addEventListener('click', handleSaveAdminChanges);
    adminAuthButton.addEventListener('click', handleAdminAuthButtonClick);
    modalLoginButton.addEventListener('click', handleAdminLogin);
    modalCloseButton.addEventListener('click', hideLoginModal);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdminLogin();
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdminLogin();
    });

    // Initial setup
    initializeLocalStorageData(); // Load data on startup for both logged-in/out states

    // Check if Miriam was already logged in (from a previous session or redirect)
    const miriamFlag = localStorage.getItem(MIRIAM_ADMIN_LOGIN_FLAG);
    console.log(`admin-script.js: Initial check for '${MIRIAM_ADMIN_LOGIN_FLAG}' in localStorage: ${miriamFlag}`);
    if (miriamFlag === 'true') {
        setAdminLoggedInState(true);
        console.log("admin-script.js: Auto-logged in based on localStorage flag.");
    } else {
        setAdminLoggedInState(false); // Start as logged out
        console.log("admin-script.js: Not auto-logged in.");
    }
});
