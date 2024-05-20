import requests
from bs4 import BeautifulSoup
from selenium import webdriver


def extract_job_postings_from_indeed(query, location):
    url = f"https://www.indeed.com/jobs?q={query}&l={location}"
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    job_postings = []
    for posting in soup.find_all("div", class_="jobsearch-SerpJobCard"):
        title = posting.find("a", class_="jobtitle").text.strip()
        company = posting.find("span", class_="company").text.strip()
        location = posting.find("span", class_="location").text.strip()
        summary = posting.find("div", class_="summary").text.strip()
        job_postings.append({"title": title, "company": company, "location": location, "summary": summary})
    return job_postings


def extract_job_postings_from_linkedin(query, location):
    url = f"https://www.linkedin.com/jobs/search/?keywords={query}&location={location}"
    driver = webdriver.Chrome() # or specify the path to your chromedriver executable
    driver.get(url)
    soup = BeautifulSoup(driver.page_source, "html.parser")
    job_postings = []
    for posting in soup.find_all("li", class_="result-card"):
        title = posting.find("h3", class_="result-card__title").text.strip()
        company = posting.find("a", class_="result-card__subtitle-link").text.strip()
        location = posting.find("span", class_="job-result-card__location").text.strip()
        summary = posting.find("div", class_="result-card__contents").text.strip()
        job_postings.append({"title": title, "company": company, "location": location, "summary": summary})
    driver.quit()
    return job_postings
