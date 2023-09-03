import time
from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())
# driver.get("https://www.codechef.com/tags/problems/dynamic-programming")
# time.sleep(5)
# html = driver.page_source
# soup = BeautifulSoup(html, 'html.parser')
# all_ques = soup.findAll("div", {"class": "problem-tagbox-inner"})
# all_ques_title = []
# all_ques_link = []
# for ques in all_ques:
#     all_ques_title.append(ques.findAll("div")[0].find("a").text)
#     all_ques_link.append("https://www.codechef.com" + ques.findAll("div")[0].find("a")['href'])
# driver.get("https://www.codechef.com/tags/problems/graphs")
# time.sleep(5)
# html = driver.page_source
# soup = BeautifulSoup(html, 'html.parser')
# all_ques = soup.findAll("div", {"class": "problem-tagbox-inner"})
# for ques in all_ques:
#     all_ques_title.append(ques.findAll("div")[0].find("a").text)
#     all_ques_link.append("https://www.codechef.com" + ques.findAll("div")[0].find("a")['href'])
# driver.get("https://www.codechef.com/tags/problems/math")
# time.sleep(5)
# html = driver.page_source
# soup = BeautifulSoup(html, 'html.parser')
# all_ques = soup.findAll("div", {"class": "problem-tagbox-inner"})
# for ques in all_ques:
#     all_ques_title.append(ques.findAll("div")[0].find("a").text)
#     all_ques_link.append("https://www.codechef.com" + ques.findAll("div")[0].find("a")['href'])
# driver.get("https://www.codechef.com/tags/problems/greedy")
# time.sleep(5)
# html = driver.page_source
# soup = BeautifulSoup(html, 'html.parser')
# all_ques = soup.findAll("div", {"class": "problem-tagbox-inner"})
# for ques in all_ques:
#     all_ques_title.append(ques.findAll("div")[0].find("a").text)
#     all_ques_link.append("https://www.codechef.com" + ques.findAll("div")[0].find("a")['href'])
#
# with open("problems_titles.txt", "w+") as f:
#     f.write('\n'.join(all_ques_title))
# with open("problems_links.txt", "w+") as f:
#     f.write('\n'.join(all_ques_link))
with open("problems_links.txt") as f:
    all_ques_link = f.read()
    all_ques_link = all_ques_link.split("\n")
cnt = 0
for quest in all_ques_link:
    cnt += 1

    driver.get(quest)
    time.sleep(4)
    html = driver.page_source
    soul = BeautifulSoup(html, 'html.parser')
    text_problem = ''
    if len(soul.findAll("div", {"id": "problem-statement"})) != 0:
        textprob = soul.find("div", {"id": "problem-statement"})
        nthchild = 0

        childrenl = list(textprob.children)
        maxlen = len(childrenl)
        while (1):
            if nthchild == maxlen:
                break
            if 'Author' in childrenl[nthchild].get_text():
                break
            else:
                text_problem = text_problem + childrenl[nthchild].get_text()
                nthchild += 1

    with open("problem_statements1/prob_" + str(cnt) + ".txt", "w+") as f:
        f.write(text_problem)
