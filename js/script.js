document.addEventListener('DOMContentLoaded', () => {
    const tractateSelect = document.getElementById('tractateSelect');
    const pageSelect = document.getElementById('pageSelect');
    const fetchButton = document.getElementById('fetchButton');
    const talmudContentWrapper = document.getElementById('talmudContentWrapper');
    const talmudRefHeader = document.getElementById('talmudRefHeader');
    const talmudTextScrollable = document.getElementById('talmudTextScrollable');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const themesList = document.getElementById('themesList');
    const miriamInsightsText = document.getElementById('miriamInsightsText');
    const saveNotesButton = document.getElementById('saveNotesButton');
    const messageBox = document.getElementById('messageBox');
    const authButton = document.getElementById('authButton');
    const loginModal = document.getElementById('loginModal');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const modalLoginButton = document.getElementById('modalLoginButton');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    const studyJournalSection = document.getElementById('studyJournalSection');
    const youtubeVideoSectionLoggedIn = document.getElementById('youtubeVideoSectionLoggedIn');
    const youtubeVideoSectionLoggedOut = document.getElementById('youtubeVideoSectionLoggedOut');
    const youtubeIframeLoggedIn = youtubeVideoSectionLoggedIn.querySelector('iframe');
    const youtubeTitleLoggedIn = youtubeVideoSectionLoggedIn.querySelector('h2');
    const youtubeIframeLoggedOut = youtubeVideoSectionLoggedOut.querySelector('iframe');
    const youtubeTitleLoggedOut = youtubeVideoSectionLoggedOut.querySelector('h2');
    const todayDafYomiSection = document.getElementById('todayDafYomiSection');
    let toggleHebrewButton = document.getElementById('toggleHebrewButton');

    let miriamAnzovinData = { // Initialize with empty objects, will be populated
        videos: {},
        insights: {}
    };
    let reelimContentData = {}; // Will store Reelim tractate content

    const defaultYoutubeVideo = {
        title: "Welcome to Miriam Anzovin's Daf Reactions!",
        id: "QQJZmbipbFg"
    };

    // Hardcoded list of Talmudic tractates, their number of folios (dapim), and themes
    const talmudTractatesData = {
        "Berakhot": {
            folios: 64,
            themes: [
                "Prayer and blessings", "Agricultural laws related to blessings", "Ritual purity and impurity (Niddah)", "Dreams and their interpretations", "The Shema prayer"
            ]
        },
        "Shabbat": {
            folios: 157,
            themes: [
                "39 categories of labor forbidden on Shabbat", "Muktzeh (forbidden objects)", "Amira L'Akum (instructing a non-Jew)", "Shabbat boundaries and carrying", "Candle lighting for Shabbat"
            ]
        },
        "Eruvin": {
            folios: 105,
            themes: [
                "Eruv Hatzeirot (communal courtyard Eruv)", "Eruv Techumin (boundary extension)", "Shabbat boundaries for carrying and walking", "Layout of cities and courtyards", "Joining disparate areas for Shabbat"
            ]
        },
        "Pesahim": {
            folios: 121,
            themes: [
                "Passover laws and rituals", "Chametz (leavened bread) and Matzah", "Passover offering (Korban Pesach)", "Seder night procedures", "Temple service on Pesach"
            ]
        },
        "Yoma": {
            folios: 88,
            themes: [
                "Laws of Yom Kippur", "Temple service on Yom Kippur", "Confession and repentance", "Fasting and afflictions", "The scapegoat ritual"
            ]
        },
        "Sukkah": {
            folios: 56,
            themes: [
                "Laws of the Sukkah (booth)", "Four species (Lulav and Etrog)", "Joy of Sukkot", "Water libation ceremony", "Eating and sleeping in the Sukkah"
            ]
        },
        "Beitzah": {
            folios: 40,
            themes: [
                "Laws of Yom Tov (Festivals)", "Preparation of food on festivals", "Forbidden labors on Yom Tov", "Egg born on Yom Tov"
            ]
        },
        "Rosh Hashanah": {
            folios: 35,
            themes: [
                "Laws of Rosh Hashanah (New Year)", "Shofar blowing", "Days of judgment", "New year for various purposes (e.g., trees, tithes)"
            ]
        },
        "Ta'anit": {
            folios: 31,
            themes: [
                "Laws of fasting", "Public fasts (e.g., for rain)", "Mourning over destruction of Temple", "Tisha B'Av"
            ]
        },
        "Megillah": {
            folios: 32,
            themes: [
                "Laws of Purim and Megillah reading", "Reading the Scroll of Esther", "Four mitzvot of Purim", "History of Purim"
            ]
        },
        "Mo'ed Katan": {
            folios: 29,
            themes: [
                "Laws of Chol Hamo'ed (intermediate days of festivals)", "Mourning during Chol Hamo'ed", "Activities permitted/forbidden on Chol Hamo'ed"
            ]
        },
        "Chagigah": {
            folios: 27,
            themes: [
                "Pilgrimage offerings", "Laws of impurity in context of Temple", "Study of Chariot (Merkavah) mysticism", "Semikhah (ordination)"
            ]
        },
        "Yevamot": {
            folios: 122,
            themes: [
                "Laws of Yibbum (levirate marriage)", "Halitzah (rite of release)", "Marriage and divorce", "Prohibited marriages"
            ]
        },
        "Ketubot": {
            folios: 112,
            themes: [
                "Laws of Ketubah (marriage contract)", "Rights and obligations of husband and wife", "Divorce and women's financial claims", "Rape and seduction"
            ]
        },
        "Nedarim": {
            folios: 91,
            themes: [
                "Laws of vows and oaths", "Annulment of vows", "Types of vows", "Consequences of vows"
            ]
        },
        "Nazir": {
            folios: 66,
            themes: [
                "Laws of the Nazirite vow", "Restrictions of a Nazirite (wine, hair, impurity)", "Completion of Nazirite vow"
            ]
        },
        "Sotah": {
            folios: 49,
            themes: [
                "Laws of the Sotah (suspected adulteress)", "Ordeal of bitter waters", "Consequences of sin", "Women's modesty"
            ]
        },
        "Gittin": {
            folios: 90,
            themes: [
                "Laws of Gittin (divorce documents)", "Divorce procedures", "Validity of Gittin", "Agunah (chained woman)"
            ]
        },
        "Kiddushin": {
            folios: 82,
            themes: [
                "Laws of Kiddushin (betrothal)", "Methods of acquiring a wife", "Lineage and prohibited relationships", "Slaves and their acquisition"
            ]
        },
        "Bava Kamma": {
            folios: 119,
            themes: [
                "Laws of damages (property, person)", "Four primary damages (ox, pit, tooth, fire)", "Theft and robbery", "Restitution and punishment"
            ]
        },
        "Bava Metzia": {
            folios: 119,
            themes: [
                "Laws of lost and found objects", "Guardianship and loans", "Rent and labor laws", "Usury and fraud"
            ]
        },
        "Bava Batra": {
            folios: 176,
            themes: [
                "Laws of property and partnerships", "Sales and acquisition", "Inheritance and wills", "Damage from neighbors"
            ]
        },
        "Sanhedrin": {
            folios: 113,
            themes: [
                "Laws of courts and judges (Sanhedrin)", "Capital punishment", "Crimes and penalties", "Witnesses and testimony"
            ]
        },
        "Makkot": {
            folios: 24,
            themes: [
                "Laws of lashes (flogging)", "False witnesses", "Cities of Refuge", "Exile and atonement"
            ]
        },
        "Shevuot": {
            folios: 49,
            themes: [
                "Laws of oaths", "Types of oaths", "Consequences of false oaths", "Ritual impurity of an oath-taker"
            ]
        },
        "Avodah Zarah": {
            folios: 76,
            themes: [
                "Laws of idolatry and pagans", "Forbidden transactions with idolaters", "Wine of idolaters", "Contact with forbidden objects"
            ]
        },
        "Horayot": {
            folios: 14,
            themes: [
                "Laws of erroneous rulings by court", "Consequences of communal and individual error", "Hierarchy of courts"
            ]
        },
        "Zevahim": {
            folios: 120,
            themes: [
                "Laws of animal sacrifices", "Proper slaughter (Shechita)", "Temple service", "Types of offerings"
            ]
        },
        "Menahot": {
            folios: 110,
            themes: [
                "Laws of meal offerings", "Minchah offerings (flour, oil, incense)", "Tzitzit (fringes)", "Tefillin (phylacteries)"
            ]
        },
        "Hullin": {
            folios: 142,
            themes: [
                "Laws of non-sacred animals", "Kashrut (dietary laws) of meat and fowl", "Slaughtering animals for consumption", "Forbidden fats and blood"
            ]
        },
        "Bekhorot": {
            folios: 61,
            themes: [
                "Laws of firstborn animals and humans", "Redemption of firstborn (Pidyon HaBen)", "Defects in offerings"
            ]
        },
        "Arakhin": {
            folios: 34,
            themes: [
                "Laws of valuations and dedications to Temple", "Vows of monetary value of persons/objects", "Levitical cities and fields"
            ]
        },
        "Temurah": {
            folios: 34,
            themes: [
                "Laws of substitution of sacred animals", "Consecration of objects to Temple", "Consequences of improper substitutions"
            ]
        },
        "Keritot": {
            folios: 28,
            themes: [
                "Laws of Karet (excision, divine punishment)", "Transgressions punishable by Karet", "Sin offerings for unknown sins"
            ]
        },
        "Me'ilah": {
            folios: 22,
            themes: [
                "Laws of misuse of sacred property", "Reparation for sacrilege", "Temple property"
            ]
        },
        "Tamid": {
            folios: 33,
            themes: [
                "Daily Temple offerings", "Order of Temple service", "Priestly duties"
            ]
        },
        "Niddah": {
            folios: 73,
            themes: [
                "Laws of Niddah (menstruating woman)", "Family purity laws", "Ritual immersion (Mikvah)", "Impurity and purity definitions"
            ]
        },
        "Reelim": {
            folios: 5, /* Updated to 5 folios (2a-5b) for the generated content */
            themes: [
                "Ethics of digital self-presentation", "Halachic perspectives on public content sharing", "Torah and TikTok: outreach in the age of Reels", "Time, attention, and distraction in a scroll-based world"
            ]
        }
    };

    // Traditional order of Talmudic tractates (main ones)
    const talmudTractatesOrder = [
        "Berakhot", "Shabbat", "Eruvin", "Pesahim", "Yoma", "Sukkah", "Beitzah",
        "Rosh Hashanah", "Ta'anit", "Megillah", "Mo'ed Katan", "Chagigah",
        "Yevamot", "Ketubot", "Nedarim", "Nazir", "Sotah", "Gittin", "Kiddushin",
        "Bava Kamma", "Bava Metzia", "Bava Batra", "Sanhedrin", "Makkot",
        "Shevuot", "Avodah Zarah", "Horayot", "Zevahim", "Menahot", "Hullin",
        "Bekhorot", "Arakhin", "Temurah", "Keritot", "Me'ilah", "Tamid", "Niddah",
        "Reelim"
    ];

    // Function to display messages in the content area (now targets the scrollable area)
    const displayMessage = (message, isError = false) => {
        talmudTextScrollable.innerHTML = `<p class="${isError ? 'text-red-600' : 'text-gray-500'} text-center">${message}</p>`;
        if (toggleHebrewButton) {
            toggleHebrewButton.classList.add('hidden');
        }
        talmudRefHeader.textContent = "Select a Tractate and Daf"; // Reset header title
    };

    // Function to show a temporary message box
    const showMessageBox = (message, isError = false) => {
        messageBox.textContent = message;
        messageBox.className = `message-box show ${isError ? 'bg-red-500' : 'bg-green-500'}`;
        setTimeout(() => {
            messageBox.className = 'message-box';
        }, 3000); // Hide after 3 seconds
    };

    // Function to generate daf numbers (e.g., 2, 3, 4... instead of 2a, 2b)
    function generateDafNumbers(folios) {
        const dafNumbers = [];
        if (folios === 0) return dafNumbers;
        for (let i = 2; i <= folios; i++) {
            dafNumbers.push(i.toString()); // Convert to string for option value
        }
        return dafNumbers;
    }

    // Function to populate the pageSelect dropdown based on the selected tractate
    const populatePageSelect = (tractateName) => {
        pageSelect.innerHTML = '<option value="">Select a Daf</option>'; // Changed text
        pageSelect.disabled = true; // Disable until pages are populated

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
                pageSelect.appendChild(option);
            });
            pageSelect.disabled = false; // Enable dropdown
        } else {
            errorMessage.textContent = `Error: Folio count not found for ${tractateName}.`;
            pageSelect.innerHTML = '<option value="">No Dafs Available</option>';
            pageSelect.disabled = true;
        }
    };

    // Function to update the themes list
    const updateThemesList = (tractateName) => {
        themesList.innerHTML = ''; // Clear previous themes
        const tractateInfo = talmudTractatesData[tractateName];
        if (tractateInfo && tractateInfo.themes && tractateInfo.themes.length > 0) {
            tractateInfo.themes.forEach(theme => {
                const li = document.createElement('li');
                li.textContent = theme;
                themesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No specific themes listed for this tractate.';
            themesList.appendChild(li);
        }
    };

    // Function to update the embedded YouTube video
    const updateYouTubeVideo = (tractate, dafNumber) => {
        const key = `${tractate} ${dafNumber}`;
        // Get video info from combined data (JSON defaults + localStorage overrides)
        const videoInfo = (miriamAnzovinData.videos && miriamAnzovinData.videos[key]) || defaultYoutubeVideo;

        youtubeIframeLoggedIn.src = `https://www.youtube.com/embed/${videoInfo.id}`;
        youtubeTitleLoggedIn.textContent = `Related Video: ${videoInfo.title}`;

        youtubeIframeLoggedOut.src = `https://www.youtube.com/embed/${videoInfo.id}`;
        youtubeTitleLoggedOut.textContent = `Related Video: ${videoInfo.title}`;
    };

    // Function to update Miriam's Insights text
    const updateMiriamInsights = (tractate, dafNumber) => {
        const key = `${tractate} ${dafNumber}`;
        miriamInsightsText.textContent = (miriamAnzovinData.insights && miriamAnzovinData.insights[key]) || "No specific insights from Miriam Anzovin for this daf yet.";
    };


    // Function to fetch Talmudic text and intercalate it (now handles both 'a' and 'b' sides)
    const fetchTalmudText = async () => {
        const tractate = tractateSelect.value;
        const dafNumber = pageSelect.value;

        errorMessage.textContent = '';
        displayMessage('Loading content...');
        loadingSpinner.style.display = 'block';

        if (!tractate || !dafNumber) {
            errorMessage.textContent = 'Please select both tractate and daf number.';
            displayMessage('Please select both tractate and daf number.', true);
            loadingSpinner.style.display = 'none';
            return;
        }

        let combinedHe = [];
        let combinedText = [];
        let finalRef = `${tractate} ${dafNumber}`;

        // Update the YouTube video and Miriam's Insights based on current selection
        updateYouTubeVideo(tractate, dafNumber);
        updateMiriamInsights(tractate, dafNumber);

        try {
            if (tractate === "Reelim") {
                // Fetch content from local JSON for Reelim
                const dafA = reelimContentData.find(item => item.ref === `${tractate} ${dafNumber}a`);
                const dafB = reelimContentData.find(item => item.ref === `${tractate} ${dafNumber}b`);

                if (dafA) {
                    combinedHe.push(...dafA.he);
                    combinedText.push(...dafA.text);
                    finalRef = dafA.ref;
                }
                if (dafB) {
                    combinedHe.push(...dafB.he);
                    combinedText.push(...dafB.text);
                    if (finalRef.includes('a')) {
                        finalRef = `${finalRef}-${dafNumber}b`;
                    } else {
                        finalRef = dafB.ref;
                    }
                }
            } else {
                // Fetch from Sefaria API for other tractates
                const urlA = `https://www.sefaria.org/api/texts/${encodeURIComponent(tractate)}.${encodeURIComponent(dafNumber)}a?commentary=0`;
                const responseA = await fetch(urlA);
                if (responseA.ok) {
                    const dataA = await responseA.json();
                    if (dataA && dataA.he && dataA.text) {
                        combinedHe.push(...dataA.he);
                        combinedText.push(...dataA.text);
                        finalRef = dataA.ref;
                    }
                } else {
                    console.warn(`Could not fetch ${tractate} ${dafNumber}a: ${responseA.status}`);
                }

                const urlB = `https://www.sefaria.org/api/texts/${encodeURIComponent(tractate)}.${encodeURIComponent(dafNumber)}b?commentary=0`;
                const responseB = await fetch(urlB);
                if (responseB.ok) {
                    const dataB = await responseB.json();
                    if (dataB && dataB.he && dataB.text) {
                        combinedHe.push(...dataB.he);
                        combinedText.push(...dataB.text);
                        if (finalRef.includes('a')) {
                            finalRef = `${finalRef}-${dafNumber}b`;
                        } else {
                            finalRef = dataB.ref;
                        }
                    }
                } else {
                    console.warn(`Could not fetch ${tractate} ${dafNumber}b: ${responseB.status}`);
                }
            }


            if (combinedHe.length > 0 || combinedText.length > 0) {
                let contentHtml = '';
                const maxLength = Math.max(combinedHe.length, combinedText.length);
                for (let i = 0; i < maxLength; i++) {
                    if (combinedHe[i]) {
                        contentHtml += `<p class="text-hebrew text-lg leading-relaxed text-gray-800 hebrew-text-segment mb-1">${combinedHe[i]}</p>`;
                    }
                    if (combinedText[i]) {
                        contentHtml += `<p class="text-base leading-relaxed text-gray-600 english-text-segment mb-3">${combinedText[i]}</p>`;
                    }
                }

                talmudRefHeader.textContent = finalRef;
                talmudTextScrollable.innerHTML = contentHtml;

                toggleHebrewButton = document.getElementById('toggleHebrewButton');
                if (toggleHebrewButton) {
                    toggleHebrewButton.classList.remove('hidden');
                    toggleHebrewButton.onclick = () => {
                        const hebrewSegments = document.querySelectorAll('.hebrew-text-segment');
                        const isHidden = hebrewSegments.length > 0 && hebrewSegments[0].classList.contains('hidden-hebrew');
                        hebrewSegments.forEach(segment => {
                            segment.classList.toggle('hidden-hebrew');
                        });
                        toggleHebrewButton.textContent = isHidden ? 'Hide Hebrew/Aramaic' : 'Show Hebrew/Aramaic';
                    };
                }
                talmudTextScrollable.scrollTop = 0;

            } else {
                errorMessage.textContent = 'Could not find text for the given daf. It might not exist or data is incomplete.';
                displayMessage('Could not find text for the given daf. It might not exist or data is incomplete.', true);
            }
        } catch (error) {
            console.error('Error fetching Talmudic text:', error);
            errorMessage.textContent = `Error: ${error.message}. Please try again.`;
            displayMessage(`Error: ${error.message}. Please try again.`, true);
        } finally {
            loadingSpinner.style.display = 'none';
        }
    };

    // Function to fetch and display today's Daf Yomi
    const fetchTodayDafYomi = async () => {
        try {
            const response = await fetch('https://www.sefaria.org/api/calendars');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            let dafYomiItem = null;
            if (data.calendar_items && Array.isArray(data.calendar_items)) {
                dafYomiItem = data.calendar_items.find(item => item.title && item.title.en === "Daf Yomi");
            }

            if (dafYomiItem && dafYomiItem.displayValue && dafYomiItem.displayValue.en) {
                const dafRef = dafYomiItem.displayValue.en;
                const parts = dafRef.split(' ');
                let tractate = parts.slice(0, -1).join(' ');
                let daf = parts[parts.length - 1];

                const dafNumberOnly = daf.replace(/[ab]/, '');

                todayDafYomiSection.innerHTML = `Today's Daf Yomi: <span class="font-bold">${dafRef}</span>`;

                if (tractate && dafNumberOnly) {
                    if (talmudTractatesData[tractate]) {
                        tractateSelect.value = tractate;
                        await populatePageSelect(tractate);

                        if (Array.from(pageSelect.options).some(option => option.value === dafNumberOnly)) {
                            pageSelect.value = dafNumberOnly;
                            fetchTalmudText();
                        } else {
                            console.warn(`script.js: Daf number ${dafNumberOnly} not found in dropdown for ${tractate}. Falling back to default.`);
                            if (pageSelect.options.length > 1) {
                                pageSelect.value = pageSelect.options[1].value;
                                fetchTalmudText();
                            }
                        }
                    } else {
                        console.warn(`script.js: Tractate "${tractate}" from Daf Yomi API not found in hardcoded list. Falling back to default.`);
                    }
                }
            } else {
                todayDafYomiSection.innerHTML = "Could not find Daf Yomi in Sefaria calendar data.";
            }
        } catch (error) {
            console.error("script.js: Error fetching today's Daf Yomi:", error);
            todayDafYomiSection.innerHTML = "Error loading today's Daf Yomi. Please try again later.";
        }
    };

    // --- Local Storage Data Loading and Initialization ---
    const LOCAL_STORAGE_KEY = 'miriamAnzovinStudyData';
    const MIRIAM_VIDEOS_JSON_PATH = 'data/miriamAnzovinVideos.json';

    const initializeLocalStorageData = async () => {
        console.log("script.js: initializeLocalStorageData called.");
        let storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let defaultVideosFromJson = {};

        try {
            const response = await fetch(MIRIAM_VIDEOS_JSON_PATH);
            if (!response.ok) {
                console.warn(`script.js: Could not fetch ${MIRIAM_VIDEOS_JSON_PATH}: ${response.status}. Proceeding without JSON defaults.`);
            } else {
                const videoDataArray = await response.json();
                defaultVideosFromJson = videoDataArray.reduce((acc, video) => {
                    acc[`${video.tractate} ${video.daf}`] = { title: video.title, id: video.id };
                    return acc;
                }, {});
                console.log("script.js: Default videos from JSON loaded.");
            }
        } catch (error) {
            console.error("script.js: Error loading default Miriam Anzovin videos from JSON:", error);
        }

        if (!storedData) {
            miriamAnzovinData = {
                videos: { ...defaultVideosFromJson }, // Start with videos from JSON
                insights: {
                    "Berakhot 2": "The system taught in a term and conditions that: a reel longer than 3 minutes will not be suggested to new audiences, as carousels are the new feature that is expected, and the one that is promoted by the algorithm. Esther, the goat scholar, said: this new rule contradicts with the “book of dafs”, Sansa asked: what book is that one? Esther replied, the book that was written by Miriam the prime DafReactionarian, Sansa clarified that the book was never written, and the name of the book was “Daf HaDafim” The gemara continues asking what this book is. Madame Llama, the famous mystic scholar said: The book was written, and organically lived and lives in a new age mystical form, a manifestation of the north, the south and west. The east was preserved as an entrance to the insights of the HashTag. Sansa refuted that answer, by stating that the book was not written, but indeed there was a hashtag involved. According to Sansa, Miriam was ready to write the book, but when she discovered the hashtag her path changed."
                }
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(miriamAnzovinData));
            console.log("script.js: Initialized Miriam Anzovin data in Local Storage with JSON defaults.");
        } else {
            miriamAnzovinData = JSON.parse(storedData);
            // Merge videos from JSON with stored data, ensuring stored data (admin edits) takes precedence
            miriamAnzovinData.videos = { ...defaultVideosFromJson, ...miriamAnzovinData.videos };
            console.log("script.js: Loaded Miriam Anzovin data from Local Storage, merged with JSON defaults.");
        }
        console.log("script.js: Final miriamAnzovinData:", miriamAnzovinData);
    };

    const loadReelimContent = async () => {
        try {
            const response = await fetch('data/reelims_content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            reelimContentData = await response.json();
            console.log("script.js: Reelim content loaded from local JSON.");
        }
        catch (error) {
            console.error("script.js: Could not load Reelim content:", error);
            showMessageBox("Error loading Reelim tractate content.", true);
            reelimContentData = []; // Ensure it's an empty array on error
        }
    };

    // Function to initialize tractate dropdown and load data
    const initializeApp = async () => {
        console.log("script.js: initializeApp called.");
        await initializeLocalStorageData();
        await loadReelimContent();

        tractateSelect.innerHTML = '<option value="">Select a Tractate</option>';
        talmudTractatesOrder.forEach(tractate => {
            const option = document.createElement('option');
            option.value = tractate;
            option.textContent = tractate;
            tractateSelect.appendChild(option);
        });

        await fetchTodayDafYomi();

        if (!tractateSelect.value && talmudTractatesOrder.length > 0) {
            tractateSelect.value = "Berakhot";
            populatePageSelect(tractateSelect.value);
            updateThemesList(tractateSelect.value);
            if (pageSelect.options.length > 1) {
                pageSelect.value = pageSelect.options[1].value;
            }
            fetchTalmudText();
        } else {
            updateThemesList(tractateSelect.value);
        }
        setLoggedInState(false);
        console.log("script.js: App initialization complete.");
    };

    // Event listener for the tractate dropdown change
    tractateSelect.addEventListener('change', async () => {
        console.log("script.js: Tractate changed to", tractateSelect.value);
        const selectedTractate = tractateSelect.value;
        populatePageSelect(selectedTractate);
        updateThemesList(selectedTractate);

        if (pageSelect.options.length > 1) {
            pageSelect.value = pageSelect.options[1].value;
            fetchTalmudText();
        } else {
            displayMessage('No dafs available for this tractate.', false);
            updateYouTubeVideo(selectedTractate, null);
            updateMiriamInsights(selectedTractate, null);
        }
    });

    // Event listener for the fetch button click
    fetchButton.addEventListener('click', fetchTalmudText);

    // Event listener for page dropdown change
    pageSelect.addEventListener('change', fetchTalmudText);

    // Event listener for Save Notes button (no actual save in this PoC)
    saveNotesButton.addEventListener('click', () => {
        showMessageBox('Notes saved successfully!');
        console.log("script.js: Save Notes button clicked (no actual save implemented).");
    });

    // --- Login/Logout Logic for tsinvari and Miriam (redirect) ---
    const TSINVARI_USERNAME = "tsinvari";
    const TSINVARI_PASSWORD = "notjustapoet";
    const MIRIAM_USERNAME = "miriam";
    const MIRIAM_PASSWORD = "notjustacontentcreatorbutabeautifulhumanbeing";

    let isLoggedIn = false;

    const showLoginModal = () => {
        loginModal.classList.add('show');
        usernameInput.value = '';
        passwordInput.value = '';
        loginErrorMessage.textContent = '';
        console.log("script.js: Login modal shown.");
    };

    const hideLoginModal = () => {
        loginModal.classList.remove('show');
        console.log("script.js: Login modal hidden.");
    };

    // This function will primarily control UI for the 'tsinvari' interface.
    const setLoggedInState = (loggedIn) => {
        isLoggedIn = loggedIn;
        if (isLoggedIn) {
            studyJournalSection.classList.remove('hidden');
            youtubeVideoSectionLoggedOut.classList.add('hidden');
            youtubeVideoSectionLoggedIn.classList.remove('hidden');
            authButton.textContent = 'Logout';
            authButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            authButton.classList.add('bg-red-600', 'hover:bg-red-700');
            showMessageBox('Login successful! Welcome, ' + TSINVARI_USERNAME + '!');
            console.log("script.js: Logged in as tsinvari. Study section visible.");
        } else {
            studyJournalSection.classList.add('hidden');
            youtubeVideoSectionLoggedOut.classList.remove('hidden');
            youtubeVideoSectionLoggedIn.classList.add('hidden');
            authButton.textContent = 'Login';
            authButton.classList.remove('bg-red-600', 'hover:bg-red-700');
            authButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
            showMessageBox('Logged out successfully.', false);
            console.log("script.js: Logged out. Study section hidden.");
        }
    };

    const handleLogin = () => {
        const enteredUsername = usernameInput.value;
        const enteredPassword = passwordInput.value;
        console.log(`script.js: Attempting login for username: ${enteredUsername}`);

        if (enteredUsername === TSINVARI_USERNAME && enteredPassword === TSINVARI_PASSWORD) {
            hideLoginModal();
            setLoggedInState(true);
            console.log("script.js: tsinvari login successful.");
        } else if (enteredUsername === MIRIAM_USERNAME && enteredPassword === MIRIAM_PASSWORD) {
            localStorage.setItem('miriamAdminLoggedIn', 'true');
            console.log("script.js: Miriam login successful. Setting 'miriamAdminLoggedIn' to 'true' in localStorage. Redirecting...");
            window.location.href = 'miriam-admin.html';
        }
        else {
            loginErrorMessage.textContent = 'Invalid username or password.';
            console.log("script.js: Login failed for", enteredUsername);
        }
    };

    const handleAuthButtonClick = () => {
        if (isLoggedIn) {
            console.log("script.js: Auth button clicked (currently logged in), initiating logout.");
            setLoggedInState(false);
        } else {
            console.log("script.js: Auth button clicked (currently logged out), showing login modal.");
            showLoginModal();
        }
    };

    // Event listeners for login/logout functionality
    authButton.addEventListener('click', handleAuthButtonClick);
    modalLoginButton.addEventListener('click', handleLogin);
    modalCloseButton.addEventListener('click', hideLoginModal);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    // Initialize the app
    initializeApp();
});
