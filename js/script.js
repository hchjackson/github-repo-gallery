const overview = document.querySelector(".overview"); // Where my profile info will appear
const username = "hchjackson";
const repoList = document.querySelector(".repo-list"); // List of repoList
const repos = document.querySelector(".repos"); // All repos container where all repo info appears
const repoData = document.querySelector(".repo-data"); // Where individual repo data will appear

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
  gitRepos();
};

// Fetching my repos
const gitRepos = async function () {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  const repoData = await fetchRepos.json();
  // console.log(repoData);
  displayRepoInfo(repoData);
};

// Displaying info about each repo
const displayRepoInfo = function (repos) {
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
