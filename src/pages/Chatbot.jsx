import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import { chatbotResponses } from '../data/chatbotResponses';
import '../styles/pages/chatbot.css';

const quickQuestions = [
  'How do I dispose of a battery?',
  'What should I do with plastic?',
  'Show my impact stats',
];

function getAssistantReply(question, metrics) {
  const normalizedQuestion = question.toLowerCase();

  if (normalizedQuestion.includes('battery')) {
    return chatbotResponses.battery;
  }

  if (normalizedQuestion.includes('plastic')) {
    return chatbotResponses.plastic;
  }

  if (normalizedQuestion.includes('glass')) {
    return chatbotResponses.glass;
  }

  if (normalizedQuestion.includes('paper') || normalizedQuestion.includes('cardboard')) {
    return chatbotResponses.paper;
  }

  if (normalizedQuestion.includes('organic') || normalizedQuestion.includes('food')) {
    return chatbotResponses.organic;
  }

  if (
    normalizedQuestion.includes('electronic') ||
    normalizedQuestion.includes('e-waste')
  ) {
    return chatbotResponses.electronics;
  }

  if (
    normalizedQuestion.includes('stats') ||
    normalizedQuestion.includes('impact') ||
    normalizedQuestion.includes('points')
  ) {
    return `You have completed ${metrics.scansCompleted} scans, saved ${metrics.savedResultsCount} results, diverted ${metrics.plasticSavedKg} kg of plastic, and reduced about ${metrics.co2ReducedKg} kg of CO2.`;
  }

  return chatbotResponses.default;
}

function Chatbot() {
  const { metrics } = useAppContext();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Ask about plastic, battery, paper, organics, electronics, or your impact stats.',
    },
  ]);

  const pushMessage = (text) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };
    const assistantMessage = {
      id: `assistant-${Date.now() + 1}`,
      role: 'assistant',
      text: getAssistantReply(text, metrics),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    pushMessage(query.trim());
    setQuery('');
  };

  const handleQuickQuestion = (question) => {
    pushMessage(question);
  };

  return (
    <MainLayout>
      <section className="page-shell chatbot-screen page-enter">
        <div className="page-heading">
          <span className="eyebrow">Eco Assistant</span>
          <h1>Get quick disposal guidance without leaving the app.</h1>
          <p>
            This chat uses predefined material guidance and can also reflect your
            locally stored EcoSort impact stats.
          </p>
        </div>

        <div className="chatbot-screen__layout">
          <Card className="chat-card">
            <div className="chat-card__messages">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`chat-bubble ${
                    message.role === 'assistant'
                      ? 'chat-bubble--assistant'
                      : 'chat-bubble--user'
                  }`}
                >
                  {message.text}
                </article>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ask about battery, plastic, stats, or composting..."
              />
              <Button type="submit">Send</Button>
            </form>
          </Card>

          <Card className="chat-side-card" tone="soft">
            <span className="card-label">Quick Prompts</span>
            <div className="quick-prompts">
              {quickQuestions.map((question) => (
                <Button
                  key={question}
                  variant="secondary"
                  fullWidth
                  onClick={() => handleQuickQuestion(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}

export default Chatbot;
