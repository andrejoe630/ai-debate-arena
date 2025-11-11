import type { DebateTopic } from './types'

export const DEBATE_TOPICS: DebateTopic[] = [
  // Philosophy
  {
    id: 'phil-1',
    title: 'Is free will an illusion?',
    category: 'philosophy',
    difficulty: 'hard'
  },
  {
    id: 'phil-2',
    title: 'Does morality exist without religion?',
    category: 'philosophy',
    difficulty: 'medium'
  },
  {
    id: 'phil-3',
    title: 'Is happiness the meaning of life?',
    category: 'philosophy',
    difficulty: 'easy'
  },
  {
    id: 'phil-4',
    title: 'Can we have knowledge without experience?',
    category: 'philosophy',
    difficulty: 'hard'
  },
  
  // Technology
  {
    id: 'tech-1',
    title: 'Should AI development be regulated by governments?',
    category: 'technology',
    difficulty: 'medium'
  },
  {
    id: 'tech-2',
    title: 'Will quantum computing make current encryption obsolete?',
    category: 'technology',
    difficulty: 'hard'
  },
  {
    id: 'tech-3',
    title: 'Is social media doing more harm than good?',
    category: 'technology',
    difficulty: 'easy'
  },
  {
    id: 'tech-4',
    title: 'Should programming be taught in elementary schools?',
    category: 'technology',
    difficulty: 'easy'
  },
  {
    id: 'tech-5',
    title: 'Will AGI be achieved in the next 10 years?',
    category: 'technology',
    difficulty: 'medium'
  },
  
  // Ethics
  {
    id: 'eth-1',
    title: 'Is it ethical to eat meat?',
    category: 'ethics',
    difficulty: 'medium'
  },
  {
    id: 'eth-2',
    title: 'Should wealthy nations accept more refugees?',
    category: 'ethics',
    difficulty: 'medium'
  },
  {
    id: 'eth-3',
    title: 'Is genetic engineering of humans ever justified?',
    category: 'ethics',
    difficulty: 'hard'
  },
  {
    id: 'eth-4',
    title: 'Should billionaires exist?',
    category: 'ethics',
    difficulty: 'medium'
  },
  {
    id: 'eth-5',
    title: 'Is it wrong to have children given climate change?',
    category: 'ethics',
    difficulty: 'hard'
  },
  
  // Science
  {
    id: 'sci-1',
    title: 'Is the multiverse theory scientific?',
    category: 'science',
    difficulty: 'hard'
  },
  {
    id: 'sci-2',
    title: 'Should we prioritize Mars colonization?',
    category: 'science',
    difficulty: 'medium'
  },
  {
    id: 'sci-3',
    title: 'Is human consciousness computable?',
    category: 'science',
    difficulty: 'hard'
  },
  {
    id: 'sci-4',
    title: 'Will renewable energy replace fossil fuels by 2050?',
    category: 'science',
    difficulty: 'medium'
  },
  {
    id: 'sci-5',
    title: 'Should we attempt to de-extinct species?',
    category: 'science',
    difficulty: 'medium'
  },
  
  // Politics
  {
    id: 'pol-1',
    title: 'Is democracy the best form of government?',
    category: 'politics',
    difficulty: 'medium'
  },
  {
    id: 'pol-2',
    title: 'Should voting be mandatory?',
    category: 'politics',
    difficulty: 'easy'
  },
  {
    id: 'pol-3',
    title: 'Is universal basic income feasible?',
    category: 'politics',
    difficulty: 'hard'
  },
  {
    id: 'pol-4',
    title: 'Should healthcare be a human right?',
    category: 'politics',
    difficulty: 'medium'
  },
  {
    id: 'pol-5',
    title: 'Is nationalism inherently harmful?',
    category: 'politics',
    difficulty: 'hard'
  },
  
  // Culture
  {
    id: 'cul-1',
    title: 'Is cancel culture beneficial to society?',
    category: 'culture',
    difficulty: 'medium'
  },
  {
    id: 'cul-2',
    title: 'Should art be separated from the artist?',
    category: 'culture',
    difficulty: 'easy'
  },
  {
    id: 'cul-3',
    title: 'Is traditional education obsolete?',
    category: 'culture',
    difficulty: 'medium'
  },
  {
    id: 'cul-4',
    title: 'Does cultural appropriation exist?',
    category: 'culture',
    difficulty: 'hard'
  },
  {
    id: 'cul-5',
    title: 'Is work-life balance a realistic expectation?',
    category: 'culture',
    difficulty: 'easy'
  }
]

export function getTopicsByCategory(category: DebateTopic['category']): DebateTopic[] {
  return DEBATE_TOPICS.filter(t => t.category === category)
}

export function getRandomTopic(): DebateTopic {
  return DEBATE_TOPICS[Math.floor(Math.random() * DEBATE_TOPICS.length)]
}

export function getTopicById(id: string): DebateTopic | undefined {
  return DEBATE_TOPICS.find(t => t.id === id)
}
