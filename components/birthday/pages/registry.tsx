import type { ComponentType } from 'react'
import { memories } from '@/lib/memoriesData'
import { BucketListPage } from './bucket-list-page'
import { CakePage } from './cake-page'
import { CoverPage } from './cover-page'
import { CrazyMemoriesPage } from './crazy-memories-page'
import { FinalePage } from './finale-page'
import { LetterPage } from './letter-page'
import { MemoryPage } from './memory-page'
import { ReasonsPage } from './reasons-page'
import { TimelinePage } from './timeline-page'
import { WelcomePage } from './welcome-page'

export type Section = 'home' | 'story' | 'memories' | 'wishes' | 'cake' | 'love'

export type PageDef = { id: string; label: string; section: Section; Component: ComponentType }

export const pages: PageDef[] = [
  { id: 'cover', label: 'Gift', section: 'home', Component: CoverPage },
  { id: 'welcome', label: 'Welcome', section: 'home', Component: WelcomePage },
  { id: 'timeline', label: 'How we met', section: 'story', Component: TimelinePage },
  ...memories.map((memory, index) => ({
    id: memory.id,
    label: memory.title,
    section: 'memories' as const,
    Component: function MemoryVaultPage() {
      return <MemoryPage memory={memory} index={index} />
    },
  })),
  { id: 'reasons', label: 'Reasons', section: 'wishes', Component: ReasonsPage },
  { id: 'crazy', label: 'Crazy moments', section: 'wishes', Component: CrazyMemoriesPage },
  { id: 'cake', label: 'Cake', section: 'cake', Component: CakePage },
  { id: 'letter', label: 'Letter', section: 'love', Component: LetterPage },
  { id: 'bucket', label: 'Promises', section: 'love', Component: BucketListPage },
  { id: 'finale', label: 'Hug', section: 'love', Component: FinalePage },
]

export const sectionStart = (section: Section) => pages.findIndex((p) => p.section === section)
