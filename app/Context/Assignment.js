"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AssignmentContext = createContext(null);
export default AssignmentContext;

export function AssignmentProvider({ children }) {
  const [assignment, setAssignment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/assignments");
        setAssignment(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const contextValue = {
    assignment,
    setAssignment,
    loading,
  };

  return (
    <AssignmentContext.Provider value={contextValue}>
      {children}
    </AssignmentContext.Provider>
  );
}

export const useAssignment = () => useContext(AssignmentContext);