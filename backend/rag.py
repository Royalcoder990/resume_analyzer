from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os
load_dotenv()
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
persist_directory = "/Users/rishabhralli/Documents/JIIT/Major1/implementation/supernewvecstore"
retrieved_vectorstore = Chroma(
    persist_directory=persist_directory, 
    embedding_function=embeddings
)
retriever = retrieved_vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 20})
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
system_prompt = (
    "You are an assistant for question-answering tasks."
    "Use the following pieces of retrieved context. If the entered topic does not qualify as a skill or"
    "even if it is a skill and the information fetched from the retrieved documents is not at all relevant, then just say the word ERROR."
    "else you may generate five questions and their answers using the following format, first a question is generated then followed by its answer."
    "You may write Q: before every question and A: before every answer.After every question and every answer please leave a line. And please try to avoid using ** or any special character to represent or highlight."
    "Make the answers atleast 50 words long."
    "\n\n"
    "{context}"
)
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}"),
    ]
)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage  
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3, max_tokens=100000)
def generate_subtopics(topic):
    prompt = (
        f"List detailed subtopics or areas of knowledge under the topic '{topic}', relevant to professional skills or industry knowledge. "
        "You just have to give the topic names only nothing else. no headings just the subtopics themselves. "
        "Limit yourself upto a maximum of 5 subtopics only. less than 5 is also acceptable."
    )
    response = llm([HumanMessage(content=prompt)]) 
    subtopics = response.content.split("\n")  
    return [sub.strip() for sub in subtopics if sub]
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)
def process_topic(topic):
    result = {}
    subtopics = generate_subtopics(topic)
    for subtopic in subtopics:
        response = rag_chain.invoke({"input": subtopic})
        if response["answer"].strip().upper() != "ERROR":
            result[subtopic] = response["answer"]
            print(subtopic)
            print(response["answer"])
    return result