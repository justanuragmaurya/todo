"use client"
import { Button } from "@/components/ui/button";
import { LoaderPinwheel, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios"


interface Task {
  id: number,
  content: String
}

export default function Home() {
  
  const [loading , setLoading] = useState<Boolean>(false);

  const task: Task = {
    id: 1,
    content: "I can not find what to write here.. so imagine I wrote some good stuff."
  }

  const [tasks, setTask] = useState<Task[]>([])

  const [taskdata,setdata] =  useState<string>("");

  const handleClick = async () => {
    const newId = Math.floor(Math.random() * 10000)
    const newTodo = {
      id: newId,
      content: taskdata
    }

    try {

      await axios.post('/api/addtodo', newTodo)
      setTask((prev) => [...prev, newTodo])
      setdata("")
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setdata(e.target.value);
  }

  const deleteTaks = async (id: Number) => {
    try {
      await axios.delete(`/api/deletetodo?id=${id}`)
      setTask((prev) => prev.filter(task => task.id != id))
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const gettodo = async () => {
    try {
      const response = await axios.get("/api/gettodo")
      return response.data
    } catch (error) {
      console.error('Failed to fetch todos:', error)
      return []
    }
  }
  
  const fetchTodos = async () => {
    try {
      const todos = await gettodo()
      setTask(todos)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchTodos()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center min-h-screen justify-center p-4">
        <div className="w-full max-w-xl flex gap-2 p-5">
          <input
            type="text"
            placeholder="add a task..."
            onChange={handleChange}
            value={taskdata}
            className="px-4 py-2 w-full border-2 border-black shadow-md transition focus:outline-none focus:shadow-xs"
          />
          <Button
            onClick={handleClick}
            className="bg-[#FFD93D] hover:bg-[#FFC93D] text-black font-bold border-2 border-black rounded-none h-12 px-4 sm:px-6 whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
          >
            Add task!
          </Button>
        </div>
        <div className="flex flex-col gap-3 w-full items-center px-4">
          {loading ? (
            <div className="flex items-center justify-center">
              <LoaderPinwheel className="animate-spin h-8 w-8" />
            </div>
          ) : (
            tasks.map((data)=>{return(
              <div key={data.id} className="flex gap-5 h-max w-full max-w-xl py-3 text-black font-bold border-2 border-black rounded-none px-4 sm:px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 justify-between">
                <h2 className="break-words flex-1">{data.content}</h2>
                <button onClick={()=>{deleteTaks(data.id)}} className="flex-shrink-0">
                  <TrashIcon className="hover:text-red-500 transition-all duration-300"/>
                </button>
              </div>
            )}))}
        </div>
      </div>
    </>
  );
}
