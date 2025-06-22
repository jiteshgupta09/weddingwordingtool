// ✅ FIXED TOOL BASED ON YOUR LATEST REQUESTS + ADDED SUMMARY VIEW

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import jsPDF from "jspdf";

const questions = [
  { id: 1, type: "mcq", label: "Host of the wedding", options: ["Bride side", "Groom side"] },
  { id: 2, type: "text", label: "Name of the Bride & Groom" },
  { id: 3, type: "text", label: "Who is inviting (Name of the parents/grandparents)" },
  { id: 4, type: "mcq", label: "Do you want to add the name of Bride's parents in your invitation?", options: ["Yes", "No"] },
  { id: 5, type: "text", label: "Enter names of Bride's parents" },
  { id: 6, type: "mcq", label: "Do you want to add the name of Groom's parents in your invitation?", options: ["Yes", "No"] },
  { id: 7, type: "text", label: "Enter names of Groom's parents" },
  { id: 8, type: "date", label: "Date of the wedding" },
  { id: 9, type: "text", label: "What time is the Wedding/Phere?" },
  { id: 10, type: "text", label: "Venue for wedding" },
  { id: 11, type: "mcq", label: "Do you want to include any additional functions page?", options: ["Yes", "No"] },
];

export default function WeddingInviteTool() {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({});
  const [functions, setFunctions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const totalSteps = 17;

  const handleInput = (value = inputValue) => {
    const newResponses = { ...responses, [step]: value };
    setResponses(newResponses);

    if (step === 4) value === "Yes" ? setStep(5) : setStep(6);
    else if (step === 6) value === "Yes" ? setStep(7) : setStep(8);
    else if (step === 11) value === "Yes" ? setStep(12) : setStep(17);
    else if (step === 16) value === "Yes" ? setStep(12) : setStep(17);
    else setStep(step + 1);

    setInputValue("");
  };

  const handleBack = () => {
    if (step === 5 && responses[4] === "No") setStep(4);
    else if (step === 6 && responses[4] === "Yes") setStep(5);
    else if (step === 7 && responses[6] === "No") setStep(6);
    else if (step === 8 && responses[6] === "Yes") setStep(7);
    else if (step === 12) setStep(11);
    else if (step === 16) setStep(15);
    else if (step > 1) setStep(step - 1);
  };

  const handleFunctionInput = () => {
    const name = document.getElementById("fname").value;
    const date = document.getElementById("fdate").value;
    const time = document.getElementById("ftime").value;
    const venue = document.getElementById("fvenue").value;

    if (name && date && time && venue) {
      setFunctions([...functions, { name, date, time, venue }]);
      setStep(16);
    } else {
      alert("Please fill in all function details.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    let y = 10;

    questions.forEach(q => {
      if ((q.id === 5 && responses[4] === "No") || (q.id === 7 && responses[6] === "No")) return;
      if (responses[q.id]) {
        doc.text(`${q.label}: ${responses[q.id]}`, 10, y);
        y += 10;
      }
    });

    functions.forEach((func, i) => {
      doc.text(`Function ${i + 1}: ${func.name}, Date: ${func.date}, Time: ${func.time}, Venue: ${func.venue}`, 10, y);
      y += 10;
    });

    doc.save("wedding_invitation_wording.pdf");
  };

  const downloadText = () => {
    let content = "";
    questions.forEach(q => {
      if ((q.id === 5 && responses[4] === "No") || (q.id === 7 && responses[6] === "No")) return;
      if (responses[q.id]) {
        content += `${q.label}: ${responses[q.id]}\n`;
      }
    });
    functions.forEach((func, i) => {
      content += `Function ${i + 1}: ${func.name}, Date: ${func.date}, Time: ${func.time}, Venue: ${func.venue}\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wedding_invitation_wording.txt";
    link.click();
  };

  const renderSummary = () => (
    <div className="flex flex-col gap-4 text-left">
      <h2 className="text-lg font-bold">Summary of Your Wedding Invite Details</h2>
      {questions.map(q => {
        if ((q.id === 5 && responses[4] === "No") || (q.id === 7 && responses[6] === "No")) return null;
        return (
          <div key={q.id}>
            <strong>{q.label}:</strong> {responses[q.id]}
          </div>
        );
      })}
      {functions.length > 0 && (
        <div>
          <strong>Functions:</strong>
          {functions.map((func, i) => (
            <div key={i} className="ml-4">
              - {func.name}, Date: {func.date}, Time: {func.time}, Venue: {func.venue}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderQuestion = () => {
    if (step === 16) {
      return (
        <div className="flex flex-col gap-4">
          <label className="text-lg font-semibold">Do you want to add another functions page?</label>
          <div className="flex gap-4">
            <Button onClick={() => handleInput("Yes")}>Yes</Button>
            <Button onClick={() => handleInput("No")}>No</Button>
            <Button variant="secondary" onClick={handleBack}>Back</Button>
          </div>
        </div>
      );
    }

    const q = questions.find((q) => q.id === step);
    if (!q) return null;

    return (
      <div className="flex flex-col gap-4">
        <label className="text-lg font-semibold">{q.label}</label>
        {q.type === "text" && (
          <input
            type="text"
            className="p-2 border rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        {q.type === "date" && (
          <input
            type="date"
            className="p-2 border rounded"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        {q.type === "mcq" && (
          <div className="flex gap-4">
            {q.options.map((opt) => (
              <Button key={opt} onClick={() => handleInput(opt)}>{opt}</Button>
            ))}
            <Button variant="secondary" onClick={handleBack}>Back</Button>
          </div>
        )}
        {(q.type === "text" || q.type === "date") && (
          <div className="flex gap-4">
            <Button onClick={() => handleInput()}>Submit</Button>
            <Button variant="secondary" onClick={handleBack}>Back</Button>
          </div>
        )}
      </div>
    );
  };

  const renderFunctionForm = () => (
    <div className="flex flex-col gap-2">
      <label>Function Name</label>
      <input type="text" className="p-2 border rounded" id="fname" />
      <label>Date</label>
      <input type="date" className="p-2 border rounded" id="fdate" />
      <label>Time</label>
      <input type="text" className="p-2 border rounded" id="ftime" />
      <label>Venue</label>
      <input type="text" className="p-2 border rounded" id="fvenue" />
      <div className="flex gap-4 mt-2">
        <Button onClick={handleFunctionInput}>Save Function</Button>
        <Button variant="secondary" onClick={handleBack}>Back</Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto p-4">
      <CardContent className="flex flex-col gap-6">
        <Progress value={(step / totalSteps) * 100} />
        {step >= 12 && step <= 15 ? renderFunctionForm() : step === 17 ? (
          <div className="flex flex-col gap-6">
            {renderSummary()}
            <div className="flex gap-4 justify-center">
              <Button onClick={downloadPDF}>Download PDF</Button>
              <Button onClick={downloadText}>Download TXT</Button>
            </div>
          </div>
        ) : (
          renderQuestion()
        )}
      </CardContent>
    </Card>
  );
}
