import { endGroup, getInput, startGroup } from '@actions/core'
import { runner } from './runner'

export async function triage (
  octokit: any,
  issue
): Promise<any> {

  const allowHost = getInput('allowHost', { required: false }) !== undefined

/*
 if 'triage' added -> execute
   if error reproducible
     - remove 'triage'
     - add 'reproducible'
     - post/edit comment with ref and bug log
   if execution successful and error not reproducible
     - remove 'triage'
     - add 'fixed?'
   if execution fails but expected error is not produced
     - post/edit comment with warning
*/

  startGroup('Print issue labels')
  const labels = issue.labels
  console.log(labels)
  endGroup()

  if (labels.find((x) => x.name === 'triage')) {
    runner(issue.body, issue.number.toString(10), allowHost)
    return
  }

  console.log('Execute runner, just in case...')
  runner(issue.body, issue.number.toString(10), allowHost)

  // const repoToken: string = getInput('token', {required: true})

    /*
    const octokit: github.GitHub = new github.GitHub(repoToken)
    const { data: comment } = await octokit.issues.createComment({
      owner: issue.owner,
      repo: issue.repo,
      issue_number: issue.number,
      body: 'Welcome message!'
    })
    */
}
