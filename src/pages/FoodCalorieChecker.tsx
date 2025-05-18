
import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface NutritionalInfo {
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  serving_size: string | null;
}

const FoodCalorieChecker = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    detectedFood: string;
    nutritionalInfo: NutritionalInfo | null;
    message: string;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCapturedImage(null);
      setResult(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Stop the camera
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.srcObject = null;
      }
    }
  };

  // Analyze the captured image
  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('https://moxxceccaftkeuaowctw.functions.supabase.co/detect-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: capturedImage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze the image');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Save the detection log if the user is authenticated
      if (isAuthenticated && user && data.detectedFood) {
        await supabase.from('food_detection_logs').insert({
          user_id: user.id,
          image_path: null, // We're not storing the image
          detected_food: data.detectedFood,
          confidence: 0.8, // Mock confidence value
          calories: data.nutritionalInfo?.calories || null
        });
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Stop the camera if it's running
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Food Calorie Checker</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Capture Food Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              {!capturedImage && (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {capturedImage && (
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={capturedImage} 
                    alt="Captured food" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {!capturedImage ? (
              <>
                <Button onClick={startCamera} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  onClick={captureImage} 
                  disabled={!videoRef.current?.srcObject || isProcessing}
                  className="flex-1"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
                <Button 
                  onClick={analyzeImage} 
                  disabled={isProcessing}
                  variant="default"
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Analyze Food
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => {
                    setCapturedImage(null);
                    setResult(null);
                  }} 
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
        
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Food Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Detected Food</h3>
                  <p className="text-2xl">{result.detectedFood}</p>
                </div>
                
                {result.nutritionalInfo ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Nutritional Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="text-xl font-bold">{result.nutritionalInfo.calories} kcal</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Serving Size</p>
                        <p className="text-lg">{result.nutritionalInfo.serving_size || '-'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-lg font-medium">{result.nutritionalInfo.protein || 0}g</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-lg font-medium">{result.nutritionalInfo.carbs || 0}g</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="text-lg font-medium">{result.nutritionalInfo.fat || 0}g</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <p className="text-amber-700">
                      No precise nutritional information available for this food in our database.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Note:</strong> This tool uses AI to detect food items and provides approximate nutritional information.
          </p>
          <p>
            For accurate dietary tracking, please consult with a nutritionist or use verified sources.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default FoodCalorieChecker;
