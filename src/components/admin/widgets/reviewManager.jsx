import { useEffect, useState } from "react"
import axios from "axios"
import { uri } from "../../../constants/constants"
import Loader, { Loader2 } from "../../../common/loader"
import Toaster from "../../../common/toaster"

const ReviewManager = () => {
    const [approved, setApproved] = useState([])
    const [unapproved, setUnapproved] = useState([])

    const [loading,setLoading]=useState(false)
    const [loading2,setLoading2]=useState(false)

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const approvedRes=await axios.get(`${uri}/approved-reviews`, { withCredentials: true })

            const unapprovedRes=await axios.get(`${uri}/api/v1/admin/unapproved-reviews`, { withCredentials: true })

            setApproved(approvedRes.data.data)
            setUnapproved(unapprovedRes.data.data)
        } catch (err) {
            Toaster(err.response.data.message,"error")
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleApprove = async (id) => {
        setLoading2(true)
        try {
            const res=await axios.post(`${uri}/api/v1/admin/approve-review`,{id}, { withCredentials: true })
            fetchReviews()
            Toaster(res.data.message,"success")
        } catch (err) {
            Toaster(err.response.data.message,"error")
        }
        finally {
            setLoading2(false)
        }
    }

    const handleDelete = async (id) => {
        setLoading2(true)
        try {
            const res=await axios.post(`${uri}/api/v1/admin/delete-review`,{id}, { withCredentials: true })
            fetchReviews()
            Toaster(res.data.message,"success")
        } catch (err) {
            Toaster(res.data.message,"success")
        }
        finally {
            setLoading2(false)
        }
    }

    return (
        <>
            {loading2?(<Loader2></Loader2>):(<></>)}
            {loading?(<Loader></Loader>):(<>
            <div className="p-6 space-y-10">
            <section>
                <h2 className="text-2xl font-semibold mb-4">Approved Reviews</h2>
                <div className="grid gap-4">
                    {approved.map((r) => (
                        <div key={r._id} className="border p-4 rounded shadow flex justify-between items-center">
                            <div>
                                <p><strong>Name:</strong> {r.name}</p>
                                <p><strong>Stars:</strong> {r.stars}</p>
                                <p><strong>Description:</strong> {r.description}</p>
                                <p><strong>Contact:</strong> {r.contact}</p>
                            </div>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleDelete(r._id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Unapproved Reviews</h2>
                <div className="grid gap-4">
                    {unapproved.map((r) => (
                        <div key={r._id} className="border p-4 rounded shadow flex justify-between items-center">
                            <div>
                                <p><strong>Name:</strong> {r.name}</p>
                                <p><strong>Stars:</strong> {r.stars}</p>
                                <p><strong>Description:</strong> {r.description}</p>
                                <p><strong>Contact:</strong> {r.contact}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleApprove(r._id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={() => handleDelete(r._id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div></>)}
        </>
    )
}

export default ReviewManager
