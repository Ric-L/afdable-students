"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { getEnrollmentRequests } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";

// Define the types
export type TEnrollmentRequest = {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  student_phone: string;
  student_grade: string;
  student_board_type: string;
  course_id: number;
  course_name: string;
  promo_code_id?: number;
  promo_code?: string;
  original_price: number;
  discounted_price: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  admin_notes?: string;
  student_notes?: string;
  requested_at: string;
  processed_at?: string;
  processed_by?: number;
  created_enrollment_id?: number;
};

export type TEnrollmentRequestResponse = {
  success: boolean;
  result?: {
    list: TEnrollmentRequest[];
    total: number;
    offset: number;
    limit: number;
  };
  error?: string;
  message?: string;
};

const Page = () => {
  const [enrollmentRequests, setEnrollmentRequests] = useState<TEnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollmentRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const enrollmentData: TEnrollmentRequestResponse = await getEnrollmentRequests();
      console.log("enrollmentData", enrollmentData);

      if (enrollmentData.success && enrollmentData.result) {
        setEnrollmentRequests(enrollmentData.result.list);
      } else {
        setError(enrollmentData.error || "Failed to fetch enrollment requests");
      }
    } catch (error) {
      console.error("Error fetching enrollment requests:", error);
      setError("An error occurred while fetching enrollment requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollmentRequests();
  }, []);

  // Calculate stats based on the actual data
  const pendingRequests = enrollmentRequests.filter((request) => request.status === "pending");
  const approvedRequests = enrollmentRequests.filter((request) => request.status === "approved");
  const rejectedRequests = enrollmentRequests.filter((request) => request.status === "rejected");

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error && enrollmentRequests.length === 0) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enrollment Requests</h1>
              <p className="text-gray-600">View and manage all your course enrollment requests</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={fetchEnrollmentRequests} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Try Again
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.label}</span>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enrollment Requests</h1>
            <p className="text-gray-600">View and manage all your course enrollment requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{enrollmentRequests.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Processing</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
                </div>
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{approvedRequests.length}</p>
                </div>
                <div className="bg-green-500 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{rejectedRequests.length}</p>
                </div>
                <div className="bg-red-500 p-2 rounded-lg">
                  <XCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Requests List */}
          <div>
            {enrollmentRequests.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Info</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrollmentRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.course_name}</p>
                              <p className="text-sm text-gray-500">ID: {request.course_id}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.student_name}</p>
                              <p className="text-sm text-gray-500">{request.student_email}</p>
                              <p className="text-sm text-gray-500">
                                Grade {request.student_grade} • {request.student_board_type}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm text-gray-900">{formatPrice(request.discounted_price)}</p>
                              {request.original_price !== request.discounted_price && <p className="text-sm text-gray-500 line-through">{formatPrice(request.original_price)}</p>}
                              {request.promo_code && <p className="text-xs text-green-600">Promo: {request.promo_code}</p>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.requested_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No enrollment requests found</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default Page;

// "use client";

// import DashboardLayout from "@/components/DashboardLayout";
// import { getEnrollmentRequests } from "@/lib/api";
// import React, { useEffect, useState } from "react";

// // Define the types
// export type TEnrollmentRequest = {
//   id: number;
//   student_id: number;
//   student_name: string;
//   student_email: string;
//   student_phone: string;
//   student_grade: string;
//   student_board_type: string;
//   course_id: number;
//   course_name: string;
//   promo_code_id?: number;
//   promo_code?: string;
//   original_price: number;
//   discounted_price: number;
//   status: "pending" | "approved" | "rejected" | "cancelled";
//   admin_notes?: string;
//   student_notes?: string;
//   requested_at: string;
//   processed_at?: string;
//   processed_by?: number;
//   created_enrollment_id?: number;
// };

// export type TEnrollmentRequestResponse = {
//   success: boolean;
//   result?: {
//     list: TEnrollmentRequest[];
//     total: number;
//     offset: number;
//     limit: number;
//   };
//   error?: string;
//   message?: string;
// };

// const Page = () => {
//   const [enrollmentRequests, setEnrollmentRequests] = useState<TEnrollmentRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchEnrollmentRequests = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const enrollmentData: TEnrollmentRequestResponse = await getEnrollmentRequests();
//       console.log("enrollmentData", enrollmentData);

//       if (enrollmentData.success && enrollmentData.result) {
//         setEnrollmentRequests(enrollmentData.result.list);
//       } else {
//         setError(enrollmentData.error || "Failed to fetch enrollment requests");
//       }
//     } catch (error) {
//       console.error("Error fetching enrollment requests:", error);
//       setError("An error occurred while fetching enrollment requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEnrollmentRequests();
//   }, []);

//   if (loading) {
//     return <div>Loading enrollment requests...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <DashboardLayout>
//       <h1>Enrollment Requests</h1>
//       {enrollmentRequests.length === 0 ? (
//         <p>No enrollment requests found.</p>
//       ) : (
//         <div>
//           {enrollmentRequests.map((request) => (
//             <div key={request.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
//               <h3>{request.course_name}</h3>
//               <p>
//                 Status: <strong>{request.status}</strong>
//               </p>
//               <p>Requested: {new Date(request.requested_at).toLocaleDateString()}</p>
//               <p>
//                 Price: ${request.original_price} → ${request.discounted_price}
//               </p>
//               {request.student_notes && <p>Notes: {request.student_notes}</p>}
//             </div>
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   );
// };

// export default Page;
