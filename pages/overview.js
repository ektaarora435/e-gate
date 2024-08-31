import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Overview() {
  // list all workouts
  const [workouts, setWorkouts] = useState([])
  const router = useRouter()

  const fetchWorkouts = async () => {
    const res = await fetch('/api/workouts')
    const data = await res.json()
    setWorkouts(data.data)
  }

  useEffect(() => {
    fetchWorkouts()
  }, []) 

  const handleDelete = async (id) => {
    const res = await fetch(`/api/workouts/${id}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      fetchWorkouts()
    }
  }

  return (
    <div>
      <Head>
        <title>Overview</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Overview</h1>

        <button onClick={() => router.push('/track')}>Track</button>

        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout._id}>
                <td>{workout.type}</td>
                <td>{workout.description}</td>
                <td>{workout.duration}</td>
                <td>
                  <button onClick={() => handleDelete(workout._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )

  // list all workouts
  
}
