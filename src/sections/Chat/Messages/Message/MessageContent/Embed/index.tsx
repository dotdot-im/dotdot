import React, { useEffect } from 'react'

import { fetchResource } from 'util/fetch'
import { useImmer } from 'use-immer'

import styles from './index.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  url: string
}

type State = {
  loading: boolean
  result: {
    title: string
    description: string
    favicon: string | null
    embed: string | null
    provider: string | null
    type: string | null
    author_name: string | null
    author_url: string | null
  } | null
}

export default ({ url }: Props) => {
  const [ state, setState ] = useImmer<State>({
    loading: false,
    result: null,
  })

  useEffect(() => {
    setState(draft => {
      draft.loading = true
    })
    fetchResource('/unfurl', 'POST', {
      url,
    })
      .then((data: any) => {
        console.log('unfurl', data);
        setState(draft => {
          draft.loading = false
          draft.result = {
            title: data.title,
            description: data.description,
            favicon: data.favicon,
            embed: null,
            provider: null,
            type: null,
            author_name: null,
            author_url: null,
          }

          if (data.twitter_card && data.twitter_card.players && data.twitter_card.players.length > 0) {
            draft.result.embed = data.twitter_card.players[0].url
          }

          if (data.oEmbed) {
            draft.result.provider = data.oEmbed.provider_name
            draft.result.type = data.oEmbed.type
            draft.result.author_name = data.oEmbed.author_name
            draft.result.author_url = data.oEmbed.author_url
          }
        })
      })
      .catch((reason) => {
        setState(draft => {
          draft.loading = true
          draft.result = null
        })
      })
  }, [url])

  if (state.loading || !state.result) {
    return null
  }

  let content = null

  switch (state.result.type) {
    case 'video':
      if (!state.result.embed) {
        return null
      }
      content = (
        <div>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              className="embed-responsive-item"
              src={ state.result.embed }
              allowFullScreen />
          </div>
          <h4>
            <a href={url} rel="noopener noreferrer" target="_blank" title={ state.result.description }>
              { state.result.title } <FontAwesomeIcon icon='external-link-alt' />
            </a>
          </h4>
        </div>
      )
      break
    default:
      content = (
        <div>
          <a href={url} rel="noopener noreferrer" target="_blank" title={ state.result.description }>
            { state.result.favicon && (
              <img className={ styles.icon } src={ state.result.favicon } />
            ) }
            { state.result.title } <FontAwesomeIcon icon='external-link-alt' />
          </a>
          { state.result.description && (
            <div>
              { state.result.description }
            </div>
          ) }
        </div>
      )
  }

  if (!content) {
    return null
  }

  return (
    <blockquote className={styles.embed}>
      { content }
    </blockquote>
  )
}