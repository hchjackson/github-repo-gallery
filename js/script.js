const overview = document.querySelector(".overview"); // Where my profile info will appear
const username = "hchjackson";
const repoList = document.querySelector(".repo-list"); // List of repoList
const repos = document.querySelector(".repos"); // All repos container where all repo info appears
const repoData = document.querySelector(".repo-data"); // Where individual repo data will appear
const viewReposButton = document.querySelector(".view-repos"); // Back to Repo Gallery button
const filterInput = document.querySelector(".filter-repos"); // select input from search

// Fetching info from my GitHub profile
const gitUserInfo = async function () {
  const userInfo = await fetch(`https://api.github.com/users/${username}`);
  const data = await userInfo.json();
  // console.log(data);
  displayUserInfo(data);
};

gitUserInfo();

// Display the fetched user info on the page
const displayUserInfo = function (data) {
  const div = document.createElement("div");
  div.classList.add("user-info");
  div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
  `;
  overview.append(div);
  gitRepos(username);
};

// Fetching my repos
const gitRepos = async function (username) {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  // console.log(repoData);
  displayRepoInfo(repoData);
};

// Displaying info about each repo
const displayRepoInfo = function (repos) {
  filterInput.classList.remove("hide"); // Show the search box
  for (const repo of repos) {
    const listItem = document.createElement("li");
    listItem.classList.add("repo");
    listItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(listItem);
  }
};

// Adding Click Event when repo name is selected
repoList.addEventListener("click", function (e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    // console.log(repoName);
    selectedRepoInfo(repoName);
  }
});

// Get Specific Repo Info
const selectedRepoInfo = async function (repoName) {
  const selectedRepo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
  const repoInfo = await selectedRepo.json();
  console.log(repoInfo);

  // Grab languages
  const fetchLanguages = await fetch(repoInfo.languages_url);
  // const fetchLanguages = await fetch(`https://api.github.com/repos/${username}/${repoName}/languages`);  // Alternative method ?
  const languageData = await fetchLanguages.json();
  console.log(languageData);

  // Make a list of languages
  const languages = []; // Empty array
  for (const lang in languageData) {
    languages.push(lang);
  }
  // console.log(languages);
  displaySelectedRepoInfo(repoInfo, languages);
};

// Display Specific Repo Info
const displaySelectedRepoInfo = function (repoInfo, languages) {
  viewReposButton.classList.remove("hide"); // Show Back to Repo Gallery button
  repoData.innerHTML = ""; // Empty out html
  repoData.classList.remove("hide"); // Show "repo-data" element
  repos.classList.add("hide"); // Hide "repos" element

  const div = document.createElement("div");
  div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repoData.append(div);
};

// Add a Click Event to the Back button
viewReposButton.addEventListener("click", function () {
  repos.classList.remove("hide"); // Unhide "repos" element
  repoData.classList.add("hide"); // Hide "repo-data" element
  viewReposButton.classList.add("hide"); // Hide Back to Repo Gallery button
});

// Add Input Event to the Search box --> Dynamic search feature
filterInput.addEventListener("input", function (e) {
  const searchText = e.target.value;
  console.log(searchText);
  const repos = document.querySelectorAll(".repo");
  const searchLowerText = searchText.toLowerCase();

  for(const repo of repos) {
    const repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(searchLowerText)) {
      repo.classList.remove("hide"); // Shows repo that matches search criteria
    }
    else {
      repo.classList.add("hide"); // Hides repo that doesn't matches search criteria
    }
  }
});
