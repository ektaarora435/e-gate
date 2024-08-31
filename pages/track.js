import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Track() {
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, description, duration }),
    })
    if (res.ok) {
      router.push('/')
    }
  }

  return (
    <div>
      <Head>
        <title>Track</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Track</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Type
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </label>
          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Duration
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  )
}
