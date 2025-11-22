import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { trimesterPrograms } from '@/data/birthBallGuideData';

const PrintableWorkoutCards = () => {
  const handlePrint = (trimester: number) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const program = trimesterPrograms.find(p => p.trimester === trimester);
    if (!program) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Trimester ${trimester} Birth Ball Exercises - Catalyst Mom</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 1cm;
              }
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              background: white;
              padding: 20px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #8b5cf6;
              padding-bottom: 20px;
            }
            
            .header h1 {
              font-size: 28px;
              color: #8b5cf6;
              margin-bottom: 10px;
            }
            
            .header .subtitle {
              font-size: 18px;
              color: #666;
              margin-bottom: 5px;
            }
            
            .header .weeks {
              display: inline-block;
              background: #f3f4f6;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 14px;
              color: #6b7280;
              margin-top: 10px;
            }
            
            .intro {
              background: #faf5ff;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 30px;
            }
            
            .intro h2 {
              color: #8b5cf6;
              margin-bottom: 10px;
              font-size: 20px;
            }
            
            .intro .goal {
              font-weight: 600;
              margin-bottom: 10px;
            }
            
            .guidelines {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .guideline-box {
              border: 2px solid #e5e7eb;
              border-radius: 10px;
              padding: 15px;
            }
            
            .guideline-box.do {
              border-color: #10b981;
              background: #f0fdf4;
            }
            
            .guideline-box.dont {
              border-color: #ef4444;
              background: #fef2f2;
            }
            
            .guideline-box h3 {
              font-size: 16px;
              margin-bottom: 10px;
            }
            
            .guideline-box.do h3 {
              color: #059669;
            }
            
            .guideline-box.dont h3 {
              color: #dc2626;
            }
            
            .guideline-box ul {
              list-style: none;
              padding-left: 0;
            }
            
            .guideline-box li {
              padding: 5px 0;
              padding-left: 20px;
              position: relative;
              font-size: 14px;
            }
            
            .guideline-box.do li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #059669;
              font-weight: bold;
            }
            
            .guideline-box.dont li:before {
              content: "✗";
              position: absolute;
              left: 0;
              color: #dc2626;
              font-weight: bold;
            }
            
            .exercises {
              display: grid;
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .exercise-card {
              border: 2px solid #e5e7eb;
              border-radius: 10px;
              padding: 20px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .exercise-header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              margin-bottom: 15px;
            }
            
            .exercise-card h3 {
              font-size: 18px;
              color: #8b5cf6;
              margin-bottom: 5px;
            }
            
            .duration {
              background: #8b5cf6;
              color: white;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 600;
              white-space: nowrap;
            }
            
            .category {
              display: inline-block;
              background: #f3f4f6;
              padding: 3px 12px;
              border-radius: 15px;
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 10px;
            }
            
            .exercise-card h4 {
              font-size: 14px;
              color: #4b5563;
              margin-bottom: 8px;
              margin-top: 15px;
            }
            
            .exercise-card ol {
              padding-left: 20px;
              margin-bottom: 15px;
            }
            
            .exercise-card ol li {
              margin-bottom: 8px;
              font-size: 14px;
              color: #374151;
            }
            
            .exercise-card ul {
              list-style: none;
              padding-left: 0;
            }
            
            .exercise-card ul li {
              padding: 5px 0;
              padding-left: 20px;
              position: relative;
              font-size: 14px;
              color: #374151;
            }
            
            .exercise-card ul li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #10b981;
              font-weight: bold;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
            
            @media print {
              .exercise-card {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Trimester ${program.trimester} Birth Ball Exercises</h1>
            <div class="subtitle">${program.title}</div>
            <div class="weeks">${program.weeks}</div>
          </div>
          
          <div class="intro">
            <h2>Program Overview</h2>
            <div class="goal"><strong>Goal:</strong> ${program.goal}</div>
            <p>${program.description}</p>
          </div>
          
          <div class="guidelines">
            <div class="guideline-box do">
              <h3>✓ What To Do</h3>
              <ul>
                ${program.whatToDo.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
            <div class="guideline-box dont">
              <h3>✗ What Not To Do</h3>
              <ul>
                ${program.whatNotToDo.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div class="exercises">
            ${program.exercises.map(exercise => `
              <div class="exercise-card">
                <div class="exercise-header">
                  <div>
                    <h3>${exercise.name}</h3>
                    <span class="category">${exercise.category}</span>
                  </div>
                  <span class="duration">${exercise.duration}</span>
                </div>
                
                <h4>Instructions:</h4>
                <ol>
                  ${exercise.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                </ol>
                
                <h4>Benefits:</h4>
                <ul>
                  ${exercise.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p><strong>Catalyst Mom</strong> • Birth Ball Exercise Guide</p>
            <p>Always consult with your healthcare provider before starting any exercise program during pregnancy.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Printable Workout Cards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Download beautifully formatted workout cards for each trimester. Perfect for printing and keeping handy during your practice.
          </p>
          {trimesterPrograms.map((program) => (
            <Button
              key={program.id}
              variant="outline"
              className="w-full justify-between group"
              onClick={() => handlePrint(program.trimester)}
            >
              <span className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Trimester {program.trimester}: {program.title.split(':')[1]}
              </span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {program.exercises.length} exercises
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintableWorkoutCards;
