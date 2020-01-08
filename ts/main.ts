import { getInput, setFailed } from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import { Context } from '@actions/github/lib/context'
import { WebhookPayload, PayloadRepository } from '@actions/github/lib/interfaces'
import { which } from '@actions/io'

import { Octokit } from '@octokit/rest'

import { triage } from './triage'
import { execute} from './runner'
import { summary} from './summary'

// import { join } from 'path'

export async function getIssues (
  octokit: any,
  args: string[],
  filterLabels?: string[]
): Promise<any> {
  const allOpenIssues = await octokit.paginate('GET /repos/:owner/:repo/issues', {
    owner: args[0],
    repo: args[1],
    state: 'open'
  })

  if (!filterLabels) {
    return allOpenIssues
  }

  const issues: any[] = []
  await Promise.all(allOpenIssues.map(async (el) => {
    if (el.labels.find((o) => filterLabels.includes(o.name))) { issues.push(el) }
  }))
  return issues
}

export async function run (): Promise<any> {
  let octokit: any
  const repoToken: string = getInput('token', { required: false })
  if (repoToken) {
    octokit = new github.GitHub(repoToken)
  } else {
    octokit = new Octokit()
  }

  await which('issue-runner', true).catch((error) => {
    console.log(error.message)
    console.log("Installing 'issue-runner' from tip...")
    const binURL = 'https://github.com/eine/issue-runner/releases/download/tip/issue-runner_lin_amd64'
    exec.exec('curl', ['-fsSL', '-o', '/usr/local/bin/issue-runner', binURL]).catch((error) => {console.log(error.message)})
    exec.exec('chmod', ['+x', '/usr/local/bin/issue-runner']).catch((error) => {console.log(error.message)})
  })

  try {
    const args = process.argv.slice(2)
    if (args.length > 0) {
      const sum = await execute(await getIssues(octokit, args))
      summary(sum)
    } else {
      const ctx: Context = github.context
      const payload: WebhookPayload = ctx.payload
      if (!payload) {
        setFailed('Empty payload!')
        return
      }
      if (ctx.eventName !== 'issues' || !payload.issue) {
        const repo: PayloadRepository | undefined = payload.repository
        if (repo && repo.full_name) {
          // TODO: this const is a string that contains an array of strings. It needs to be converted.
          // const filterLabels = getInput('allowHost', { required: false })
          const sum = await execute(await getIssues(
            octokit,
            repo.full_name.split('/'),
            ['fixed?', 'triage', 'reproducible']
          ))
          summary(sum)
          return
        }
        setFailed("Empty payload 'issue' and 'repository'!")
        return
      }

      const supportedEvents = ['opened', 'edited', 'labeled', 'unlabeled']
      if (supportedEvents.indexOf(payload.action || 'undefined_action') < 0) {
        console.log("issue neither 'opened', 'edited', 'labeled' nor 'unlabeled'; skipping")
        return
      }
      triage(octokit, payload.issue)
    }
  } catch (error) {
    setFailed(error.message)
    // throw error
  }
}

run()

/*
pull_request:      issues:       issue_comment:

opened             opened         created
edited             edited         edited
closed             closed
                   deleted        deleted
assigned           assigned
unassigned         unassigned
labeled            labeled
unlabeled          unlabeled
reopened           reopened
locked             locked
unlocked           unlocked
synchronize
ready_for_review
                   pinned
                   unpinned
                   milestoned
                   demilestoned
                   transferred
*/

// https://github.com/actions/labeler
// https://github.com/actions/first-interaction/blob/master/src/main.ts

// https://octokit.github.io/rest.js/
