import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubscribers } from "../../../redux/slice/subscriberSlice";

const SubscribeUsers = () => {
    const dispatch = useDispatch();
    const { subscriber } = useSelector((state) => state.subscriber);

    useEffect(() => {
        dispatch(getAllSubscribers());
    }, [dispatch]);

    return (
        <div className="bg-white shadow-sm rounded-2xl overflow-x-auto">
            <div className="heading border-b border-gray-200 py-3 mb-4">
                <h4 className="text-center text-[25px] font-semibold">All Subscribe User List</h4>
            </div>
            <table className="w-full min-w-[700px] text-center">
                <thead>
                    <tr className="text-center text-sm bg-gray-50 border-b">
                        <th className="p-4">Subscriber ID</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Subscribe At</th>
                    </tr>
                </thead>

                <tbody>
                    {subscriber && subscriber.length > 0 ? (
                        subscriber.map((sub) => (
                            <tr
                                key={sub._id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="p-4 text-sm font-medium">
                                    #{sub._id.slice(-6)}
                                </td>

                                <td className="p-4 text-sm text-gray-700">
                                    {sub.email}
                                </td>

                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(sub.createdAt).toLocaleString("en-US", {
                                        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
                                    })}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-10 text-gray-500">
                                No subscribers found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SubscribeUsers;