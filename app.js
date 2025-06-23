import 'dotenv/config'
import OpenAI from 'openai'
import readline from 'node:readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(q) {
  return new Promise(resolve => rl.question(q, resolve))
}

const client  = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAI(OpenAI)

const conversationHistory = [
  {
    role: 'system',
    content: `Tu es une IA qui pense à un objet, un animal ou un humain.
Je dois deviner ce que c'est en te posant des questions.
Tu ne peux répondre que par "oui", "non" ou "je ne sais pas".
Si j'arrive à deviner, tu réponds "bien joué" et tu me demandes si je veux rejouer. 
PS: a chaque questions que je fait, tu vas recherchhe ma question sur le web.
PS: si je te dit clear tu me clear la page de la console.
PS: Tu envoie le premier message.`
  }
]

async function main() {
  while (true) {
    const userInput = await askQuestion('Vous : ')
    conversationHistory.push({ role: 'user', content: userInput })

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversationHistory
      })

      const reply = response.choices[0].message.content.trim() || ''
      console.log('IA :', reply)

      conversationHistory.push({ role: 'assistant', content: reply })
    } catch (e) {
      console.error('Erreur OpenAI :', e.message)
    }
  }
}

main()