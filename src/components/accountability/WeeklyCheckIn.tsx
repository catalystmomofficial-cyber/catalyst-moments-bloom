import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Calendar, Target, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import progressPhotoGuide from '@/assets/progress-photo-guide-woman.png';

export const WeeklyCheckIn = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressImage, setProgressImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [checkInData, setCheckInData] = useState({
    weight: '',
    chest: '',
    upperArm: '',
    hip: '',
    waist: '',
    glute: '',
    thigh: '',
    description: '',
    notes: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProgressImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadProgressImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('progress-photos')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      if (progressImage) {
        imageUrl = await uploadProgressImage(progressImage);
        if (!imageUrl) {
          toast({
            title: "Upload failed",
            description: "Failed to upload progress photo",
            variant: "destructive"
          });
          return;
        }
      }
      
      const { error } = await supabase
        .from('weekly_checkins')
        .insert({
          user_id: user.id,
          week_date: format(new Date(), 'yyyy-MM-dd'),
          weight: checkInData.weight ? parseFloat(checkInData.weight) : null,
          chest_measurement: checkInData.chest ? parseFloat(checkInData.chest) : null,
          upper_arm_measurement: checkInData.upperArm ? parseFloat(checkInData.upperArm) : null,
          hip_measurement: checkInData.hip ? parseFloat(checkInData.hip) : null,
          waist_measurement: checkInData.waist ? parseFloat(checkInData.waist) : null,
          glute_measurement: checkInData.glute ? parseFloat(checkInData.glute) : null,
          thigh_measurement: checkInData.thigh ? parseFloat(checkInData.thigh) : null,
          progress_image_url: imageUrl,
          description: checkInData.description || null,
          notes: checkInData.notes || null
        });
      
      if (error) {
        toast({
          title: "Check-in failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Check-in completed!",
        description: "Your weekly progress has been recorded",
      });
      
      // Reset form
      setCheckInData({
        weight: '',
        chest: '',
        upperArm: '',
        hip: '',
        waist: '',
        glute: '',
        thigh: '',
        description: '',
        notes: ''
      });
      setProgressImage(null);
      setPreviewUrl(null);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const weekRange = format(new Date(), 'MMM d') + ' - ' + format(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), 'MMM d');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Target className="h-5 w-5" />
          Weekly Check-In
        </CardTitle>
        <CardDescription className="flex items-center justify-center gap-1">
          <Calendar className="h-4 w-4" />
          {weekRange}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Progress Photo Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Upload Progress Pictures
            </Label>
            
            {/* Professional Photo Guide */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium mb-3">Photo Pose Guide - Copy These Positions:</h4>
              <div className="bg-card rounded-lg p-4 border">
                <img
                  src={progressPhotoGuide}
                  alt="Progress photo pose guide showing front, side, and back view positions"
                  className="w-full h-auto max-h-40 object-contain filter"
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Take photos from these three angles: Front • Side • Back
              </p>
            </div>

            <div className="text-xs text-muted-foreground mb-2 space-y-1 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-900">📸 Photo Tips:</p>
              <p>• Use good natural lighting (near a window)</p>
              <p>• Stand against a plain, light-colored wall</p>
              <p>• Wear fitted clothing or workout attire</p>
              <p>• Take photos at the same time of day</p>
              <p>• Keep the same distance from camera</p>
            </div>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              {previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl}
                    alt="Progress preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProgressImage(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Upload Photo</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Measurements */}
          <div className="space-y-3">
            <Label className="font-medium">Weights & Measurements</Label>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm">Weight</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={checkInData.weight}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, weight: e.target.value }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[2rem]">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chest" className="text-sm">Chest</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="chest"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={checkInData.chest}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, chest: e.target.value }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upperArm" className="text-sm">Upper Arm</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="upperArm"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={checkInData.upperArm}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, upperArm: e.target.value }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hip" className="text-sm">Hip</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="hip"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={checkInData.hip}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, hip: e.target.value }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist" className="text-sm">Waist</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={checkInData.waist}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, waist: e.target.value }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="glute" className="text-sm">Glute</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="glute"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={checkInData.glute}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, glute: e.target.value }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thigh" className="text-sm">Thigh</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="thigh"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={checkInData.thigh}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, thigh: e.target.value }))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="How do you feel about your progress? Any changes you've noticed?"
              value={checkInData.description}
              onChange={(e) => setCheckInData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How are you feeling? Any challenges or wins this week?"
              value={checkInData.notes}
              onChange={(e) => setCheckInData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Update Check-in'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};