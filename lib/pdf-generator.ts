interface VideoMetadata {
  title: string
  channel: string
  duration: string
  publishDate: string
  description: string
  tags: string[]
}

interface PDFGeneratorOptions {
  transcription: string
  videoMetadata: VideoMetadata
  videoUrl: string
}

export async function generateTranscriptPDF({ transcription, videoMetadata, videoUrl }: PDFGeneratorOptions) {
  // Import jsPDF dynamically to avoid SSR issues
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - margin * 2

  let yPosition = margin

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize = 12, fontStyle = "normal", color = "#000000") => {
    doc.setFontSize(fontSize)
    doc.setFont("helvetica", fontStyle)
    doc.setTextColor(color)

    const lines = doc.splitTextToSize(text, maxWidth)

    // Check if we need a new page
    if (yPosition + lines.length * fontSize * 0.5 > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }

    doc.text(lines, margin, yPosition)
    yPosition += lines.length * fontSize * 0.5 + 5
  }

  // Helper function to add a section break
  const addSectionBreak = () => {
    yPosition += 10
    if (yPosition > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
    }
  }

  // Header
  doc.setFillColor(240, 240, 240)
  doc.rect(0, 0, pageWidth, 40, "F")

  // Logo/Brand
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.setTextColor("#1f2937")
  doc.text("Hilight", margin, 25)

  // Subtitle
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.setTextColor("#6b7280")
  doc.text("AI-Powered Learning Platform", margin, 35)

  yPosition = 60

  // Video Information Section
  addText("VIDEO INFORMATION", 16, "bold", "#1f2937")
  addSectionBreak()

  addText(`Title: ${videoMetadata.title}`, 12, "bold")
  addText(`Channel: ${videoMetadata.channel}`, 11)
  addText(`Duration: ${videoMetadata.duration}`, 11)
  addText(`Published: ${videoMetadata.publishDate}`, 11)
  addText(`URL: ${videoUrl}`, 11, "normal", "#3b82f6")

  addSectionBreak()

  addText("Description:", 12, "bold")
  addText(videoMetadata.description, 11)

  addSectionBreak()

  addText("Tags:", 12, "bold")
  addText(videoMetadata.tags.join(", "), 11, "normal", "#6b7280")

  addSectionBreak()
  addSectionBreak()

  // Transcription Section
  addText("VIDEO TRANSCRIPTION", 16, "bold", "#1f2937")
  addSectionBreak()

  // Process transcription with markdown-like formatting
  const sections = transcription.split("\n\n")

  for (const section of sections) {
    if (section.trim() === "") continue

    // Handle headers (##)
    if (section.startsWith("## ")) {
      addSectionBreak()
      addText(section.replace("## ", ""), 14, "bold", "#374151")
      continue
    }

    // Handle subheaders (###)
    if (section.startsWith("### ")) {
      addSectionBreak()
      addText(section.replace("### ", ""), 12, "bold", "#4b5563")
      continue
    }

    // Handle code blocks
    if (section.includes("```")) {
      const parts = section.split("```")
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // Regular text
          if (parts[i].trim()) {
            addText(parts[i].trim(), 11)
          }
        } else {
          // Code block
          addSectionBreak()

          // Add code background
          const codeLines = doc.splitTextToSize(parts[i].trim(), maxWidth - 20)
          const codeHeight = codeLines.length * 6 + 10

          if (yPosition + codeHeight > pageHeight - margin) {
            doc.addPage()
            yPosition = margin
          }

          doc.setFillColor(248, 250, 252)
          doc.rect(margin, yPosition - 5, maxWidth, codeHeight, "F")

          doc.setFontSize(10)
          doc.setFont("courier", "normal")
          doc.setTextColor("#1f2937")
          doc.text(codeLines, margin + 10, yPosition + 5)

          yPosition += codeHeight + 5
          addSectionBreak()
        }
      }
      continue
    }

    // Handle bullet points
    if (section.includes("- ")) {
      const lines = section.split("\n")
      for (const line of lines) {
        if (line.trim().startsWith("- ")) {
          addText(`• ${line.replace("- ", "")}`, 11)
        } else if (line.trim()) {
          addText(line.trim(), 11)
        }
      }
      addSectionBreak()
      continue
    }

    // Handle numbered lists
    if (/^\d+\./.test(section.trim())) {
      const lines = section.split("\n")
      for (const line of lines) {
        if (line.trim()) {
          addText(line.trim(), 11)
        }
      }
      addSectionBreak()
      continue
    }

    // Regular paragraph
    addText(section.trim(), 11)
    addSectionBreak()
  }

  // Footer on last page
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    // Page number
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#9ca3af")
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 30, pageHeight - 10)

    // Footer text
    doc.text("Generated by Hilight AI Learning Platform", margin, pageHeight - 10)

    // Generation date
    const now = new Date()
    doc.text(
      `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
      pageWidth - margin - 80,
      pageHeight - 20,
    )
  }

  // Save the PDF
  const fileName = `${videoMetadata.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_transcript.pdf`
  doc.save(fileName)
}
