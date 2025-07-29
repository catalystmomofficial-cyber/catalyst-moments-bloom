import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Calendar, Target, Upload, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import progressPhotoGuide from '@/assets/progress-photo-guide-woman.png';
export const WeeklyCheckIn = () => {
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPhotos, setProgressPhotos] = useState<{
    front?: {
      file: File;
      url: string;
    };
    side?: {
      file: File;
      url: string;
    };
    back?: {
      file: File;
      url: string;
    };
  }>({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photoTypes = [{
    key: 'front',
    label: 'Front View',
    instruction: 'Stand straight, arms at sides'
  }, {
    key: 'side',
    label: 'Side View',
    instruction: 'Profile, natural posture'
  }, {
    key: 'back',
    label: 'Back View',
    instruction: 'Turn around, same position'
  }];
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
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, photoType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProgressPhotos(prev => ({
        ...prev,
        [photoType]: {
          file,
          url
        }
      }));
    }
  };
  const removePhoto = (photoType: string) => {
    setProgressPhotos(prev => {
      const updated = {
        ...prev
      };
      delete updated[photoType as keyof typeof updated];
      return updated;
    });
  };
  const uploadProgressImages = async (): Promise<string[]> => {
    if (!user) return [];
    const uploadPromises = Object.entries(progressPhotos).map(async ([type, photo]) => {
      if (!photo) return null;
      const fileExt = photo.file.name.split('.').pop();
      const fileName = `${user.id}/${type}/${Date.now()}.${fileExt}`;
      const {
        error
      } = await supabase.storage.from('progress-photos').upload(fileName, photo.file);
      if (error) {
        console.error('Upload error:', error);
        return null;
      }
      return fileName;
    });
    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (Object.keys(progressPhotos).length > 0) {
        imageUrls = await uploadProgressImages();
        if (imageUrls.length === 0 && Object.keys(progressPhotos).length > 0) {
          toast({
            title: "Upload failed",
            description: "Failed to upload progress photos",
            variant: "destructive"
          });
          return;
        }
      }
      const {
        error
      } = await supabase.from('weekly_checkins').insert({
        user_id: user.id,
        week_date: format(new Date(), 'yyyy-MM-dd'),
        weight: checkInData.weight ? parseFloat(checkInData.weight) : null,
        chest_measurement: checkInData.chest ? parseFloat(checkInData.chest) : null,
        upper_arm_measurement: checkInData.upperArm ? parseFloat(checkInData.upperArm) : null,
        hip_measurement: checkInData.hip ? parseFloat(checkInData.hip) : null,
        waist_measurement: checkInData.waist ? parseFloat(checkInData.waist) : null,
        glute_measurement: checkInData.glute ? parseFloat(checkInData.glute) : null,
        thigh_measurement: checkInData.thigh ? parseFloat(checkInData.thigh) : null,
        progress_image_url: imageUrls.length > 0 ? imageUrls[0] : null,
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
        description: "Your weekly progress has been recorded"
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
      setProgressPhotos({});
      setCurrentPhotoIndex(0);
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
  return <Card className="w-full max-w-md mx-auto">
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
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Photo Upload Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Camera className="h-5 w-5" />
              Upload Progress Pictures
            </Label>
            
            {/* Photo Carousel */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              {/* Carousel Header */}
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <span className="text-sm font-medium">
                  {photoTypes[currentPhotoIndex]?.label || 'Photo Guide'}
                </span>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))} disabled={currentPhotoIndex === 0}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentPhotoIndex + 1} / {photoTypes.length}
                  </span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentPhotoIndex(Math.min(photoTypes.length - 1, currentPhotoIndex + 1))} disabled={currentPhotoIndex === photoTypes.length - 1}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Photo Content */}
              <div className="p-4">
                {(() => {
                const currentPhotoType = photoTypes[currentPhotoIndex];
                const hasPhoto = progressPhotos[currentPhotoType.key as keyof typeof progressPhotos];
                return <div className="space-y-3">
                      {hasPhoto ? <div className="relative">
                          <img src={hasPhoto.url} alt={`Progress photo - ${currentPhotoType.label}`} className="w-full h-48 object-cover rounded-lg" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => removePhoto(currentPhotoType.key)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div> : <div className="space-y-3">
                          {/* Clickable guide image */}
                          <label className="cursor-pointer block">
                            <input type="file" accept="image/*" onChange={e => handleImageUpload(e, currentPhotoType.key)} className="hidden" />
                            <div className="bg-muted/20 rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                              <img src={progressPhotoGuide} alt="Click to upload progress photo" className="w-full h-32 object-contain opacity-60 hover:opacity-80 w-full \n" />
                              <div className="text-center mt-2">
                                <Camera className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-sm font-medium">Tap to Upload {currentPhotoType.label}</p>
                                <p className="text-xs text-muted-foreground">{currentPhotoType.instruction}</p>
                              </div>
                            </div>
                          </label>
                        </div>}
                    </div>;
              })()}
              </div>
            </div>

            {/* Photo Tips */}
            <div className="text-xs text-muted-foreground space-y-1 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border">
              <p className="font-medium text-blue-900 dark:text-blue-100">📸 Photo Tips:</p>
              <p>• Use good natural lighting (near a window)</p>
              <p>• Stand against a plain, light-colored wall</p>
              <p>• Wear fitted clothing or workout attire</p>
              <p>• Take photos at the same time of day</p>
              <p>• Keep the same distance from camera</p>
            </div>
          </div>

          {/* Measurements */}
          <div className="space-y-3">
            <Label className="font-medium">Weights & Measurements</Label>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm">Weight</Label>
              <div className="flex items-center gap-2">
                <Input id="weight" type="number" step="0.1" placeholder="0.0" value={checkInData.weight} onChange={e => setCheckInData(prev => ({
                ...prev,
                weight: e.target.value
              }))} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[2rem]">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chest" className="text-sm">Chest</Label>
              <div className="flex items-center gap-2">
                <Input id="chest" type="number" step="0.1" placeholder="0.0" value={checkInData.chest} onChange={e => setCheckInData(prev => ({
                ...prev,
                chest: e.target.value
              }))} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upperArm" className="text-sm">Upper Arm</Label>
              <div className="flex items-center gap-2">
                <Input id="upperArm" type="number" step="0.1" placeholder="0.0" value={checkInData.upperArm} onChange={e => setCheckInData(prev => ({
                ...prev,
                upperArm: e.target.value
              }))} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hip" className="text-sm">Hip</Label>
              <div className="flex items-center gap-2">
                <Input id="hip" type="number" step="0.1" placeholder="0.0" value={checkInData.hip} onChange={e => setCheckInData(prev => ({
                ...prev,
                hip: e.target.value
              }))} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist" className="text-sm">Waist</Label>
              <div className="flex items-center gap-2">
                <Input id="waist" type="number" step="0.1" placeholder="0.0" value={checkInData.waist} onChange={e => setCheckInData(prev => ({
                ...prev,
                waist: e.target.value
              }))} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="glute" className="text-sm">Glute</Label>
              <div className="flex items-center gap-2">
                <Input id="glute" type="number" step="0.1" placeholder="0.0" value={checkInData.glute} onChange={e => setCheckInData(prev => ({
                ...prev,
                glute: e.target.value
              }))} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thigh" className="text-sm">Thigh</Label>
              <div className="flex items-center gap-2">
                <Input id="thigh" type="number" step="0.1" placeholder="0.0" value={checkInData.thigh} onChange={e => setCheckInData(prev => ({
                ...prev,
                thigh: e.target.value
              }))} className="flex-1" />
                <span className="text-sm text-muted-foreground min-w-[2rem]">cm</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="How do you feel about your progress? Any changes you've noticed?" value={checkInData.description} onChange={e => setCheckInData(prev => ({
            ...prev,
            description: e.target.value
          }))} rows={3} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" placeholder="How are you feeling? Any challenges or wins this week?" value={checkInData.notes} onChange={e => setCheckInData(prev => ({
            ...prev,
            notes: e.target.value
          }))} rows={3} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Update Check-in'}
          </Button>
        </form>
      </CardContent>
    </Card>;
};