import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner"
import { Star, Copy, Check, Loader2, Code2 } from "lucide-react";
import { useWidgetSettings } from "@/hooks/useWidgetSettings";
import { useRequests } from "@/hooks/useRequests";
import { getEmbedSnippetApi } from "@/api/widget.api";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

const COLOR_PRESENTS = [
    "#C96B3F", "#2D5A3D", "#2D4EF5", "#7B3F6E", "#C8F135", "#3B82F6"
]

const LAYOUT_OPTIONS = [
    { value: "card", label: "Card" },
    { value: "carousel", label: "Carousel" },
    {value:"list",label:"List"}
]

const RADIUS_OPTIONS = [
    {value:"none",label:"None"},
    {value:"small",label:"Small"},
    {value:"medium",label:"Medium"},
    {value:"large",label:"Large"},
]

const FONT_OPTIONS = [
{value:"inherit",label:"Inherit site font"},
{value:"inter",label:"Inter"},
{value:"serif",label:"Serif"},
]


type ToggleKey = "showRating" | "showAvatar" | "showCompany" | "showVerifiedBadge"

const DISPLAY_TOGGLES: { key: ToggleKey; label: string }[] = [
    { key: "showRating", label: "Show star rating" },
    {key:"showAvatar",label:"Show client photo"},
    {key:"showCompany",label:"Show company name"},
    {key:"showVerifiedBadge",label:"Show verified name"},
]

const radiusMap: Record<string, string> = {
    none: "0px",
    small: "4px",
    medium: "8px",
    large:"16px"
}

const WidgetSettingsPage = () => {
    const { settings, isLoading, updateSettings } = useWidgetSettings()
    const { requests } = useRequests()
    
    type LocalSettings = NonNullable<typeof settings>
    
    const [localSettings, setLocalSettings] = useState(settings)
    const [isSaving, setIsSaving] = useState(false)
    const [selectedRequestId, setSelectedRequestId] = useState<string>("")
    const [copied, setCopied] = useState(false)
    
    const [prevSettings, setPrevSettings] = useState(settings);
    if (settings !== prevSettings) {
        setPrevSettings(settings)
        setLocalSettings(settings)
    }

    const effectiveRequestId = selectedRequestId || requests[0]?._id || ""
    const selectedRequest = requests.find((r) => r._id === effectiveRequestId)
    

    const [snippetState, setSnippetState] = useState<{ requestId: string; value: string | null }>({
        requestId: "",
        value:null
    })

    useEffect(() => {
        if (!selectedRequest?.token) return
        
        getEmbedSnippetApi(selectedRequest.token)
            .then((res) =>
                setSnippetState({ requestId: effectiveRequestId, value: res.data.data?.snippet ?? null }))
            .catch(()=>toast.error("Failed to load embed snippet"))
    },[effectiveRequestId,selectedRequest])
        
    const isLoadingSnippet=!!selectedRequest?.token && snippetState.requestId !== effectiveRequestId
    const snippet = snippetState.requestId === effectiveRequestId ? snippetState.value : null;

    const handleChange = useCallback(
        (key: keyof LocalSettings, value: LocalSettings[keyof LocalSettings]) => {
            setLocalSettings((prev)=>(prev ? ({...prev,[key]:value} as LocalSettings):prev))
        },
        []
    )

    const handleSave = async () => {
        if (!localSettings) return
        setIsSaving(true)
        try {
            await updateSettings({
                primaryColor: localSettings.primaryColor,
                theme: localSettings.theme,
                layout: localSettings.layout,
                fontFamily: localSettings.fontFamily,
                borderRadius: localSettings.borderRadius,
                showVerifiedBadge: localSettings.showVerifiedBadge,
                showRating: localSettings.showRating,
                showAvatar: localSettings.showAvatar,
                showCompany: localSettings.showCompany,
                maxTestimonialsToShow:localSettings.maxTestimonialsToShow
            })
            toast.success("Widget settings saved successfully")
        } catch (err:unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data.message ?? "Failed to save settings")
            }
        } finally {
            setIsSaving(false)
        }
    }

    const handleCopySnippet = () => {
        if (!snippet) return;
        navigator.clipboard.writeText(snippet)
        setCopied(true)
        toast.success("Snippet copied to clipboard")
        setTimeout(()=>setCopied(false),2000)
    }

    if (isLoading || !localSettings) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48"/>
                <Skeleton className="h-150 w-full"/>
            </div>
        )
    }
  return (
      <div className="space-y-4">
          <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Widget</h1>
              <p className="mt-1 text-sm text-text-secondary">
                  Customize how your testimonials look when embedded.
              </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* settigns */}
              <div className="space-y-6">
                  <Card className="border-border bg-surface">
                      <CardHeader>
                          <CardTitle className="text-base">Primary color</CardTitle>
                          <CardDescription>Used for star ratings and accents</CardDescription>
                      </CardHeader>

                      <CardContent className="flex flex-wrap gap-3">
                          {COLOR_PRESENTS.map((color) => (
                              <button
                                  key={color}
                                  onClick={() => handleChange("primaryColor", color)}
                                  className={cn(
                                      "h-10 w-10 rounded-full border-2 transition-all hover:scale-110",
                                      localSettings.primaryColor === color ?
                                          "border-text-primary ring-2 ring-offset-2 ring-text-primary/30"
                                          :"border-transparent"
                                  )}
                                  style={{backgroundColor:color}}
                              />
                          ))}

                          <input type="color"
                              value={localSettings.primaryColor}
                              onChange={(e) => handleChange("primaryColor", e.target.value)}
                              className="h-10 w-10 cursor-pointer rounded-full border border-border bg-transparent"
                          />
                      </CardContent>
                  </Card>

                  {/* appearance */}
                  <Card className="border-border bg-surface">
                      <CardHeader>
                          <CardTitle className="text-base">Appearance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                          <div className="space-y-1.5">
                              <Label>Theme</Label>
                              <div className="grid grid-cols-2 gap-2">
                                  {(["light", "dark"] as const).map((t) => (
                                      <button
                                          key={t}
                                          onClick={() => handleChange("theme", t)}
                                          className={cn(
                                              "rounded-md border py-2.5 text-sm capitalize transition",
                                              localSettings.theme === t
                                                  ? "border-text-primary bg-card"
                                                  :"border-border hover:bg-card"
                                          )}
                                      >
                                          {t}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className="space-y-1.5">
                              <Label>Layout</Label>
                              <Select value={localSettings.layout} onValueChange={(v) => handleChange("layout", v)}>
                                  <SelectTrigger>
                                      <SelectValue/>
                                  </SelectTrigger>

                                  <SelectContent>
                                      {LAYOUT_OPTIONS.map((o) => (
                                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                  <Label>Font</Label>
                                  <Select value={localSettings.fontFamily} onValueChange={(v) => handleChange("fontFamily", v)}>
                                      <SelectTrigger>
                                          <SelectValue/>
                                      </SelectTrigger>
                                      <SelectContent>
                                          {FONT_OPTIONS.map((o) => (
                                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              </div>

                              <div className="space-y-1.5">
                                  <Label>Border radius</Label>
                                  <Select value={localSettings.borderRadius} onValueChange={(v) => handleChange("borderRadius", v)}>
                                      <SelectTrigger>
                                          <SelectValue/>
                                      </SelectTrigger>
                                      <SelectContent>
                                          {RADIUS_OPTIONS.map((o) => (
                                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              </div>
                          </div>
                      </CardContent>
                  </Card>


                  {/* display options */}
                  <Card className="border-border bg-surface">
                      <CardHeader>
                          <CardTitle className="text-base">Display options</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                          {DISPLAY_TOGGLES.map(({ key, label }) => (
                              <div key={key} className="flex items-center justify-between py-1">
                                  <span className="text-sm text-text-primary">{label}</span>

                                  <button
                                      onClick={() => handleChange(key, !localSettings[key])}
                                      className={cn(
                                          "relative h-6 w-11 rounded-full transition-all",
                                          localSettings[key]?"bg-text-primary":"bg-border"
                                      )}
                                  >
                                      
                                      <span className={cn(
                                          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all",
                                          localSettings[key]?"translate-x-5":""
                                      )}/>
                                  </button>
                              </div>
                          ))}

                          <div className="pt-4">
                              <Label className="mb-2 block">
                                  Max testimonials shown: <span className="font-medium">{localSettings.maxTestimonialsToShow}</span>
                              </Label>

                              <input type="range"
                                  min={1}
                                  max={10}
                                  value={Number(localSettings.maxTestimonialsToShow)}
                                  onChange={(e)=>handleChange("maxTestimonialsToShow",parseInt(e.target.value,10))}
                                className="w-full accent-text-primary"
                              />
                          </div>
                      </CardContent>
                  </Card>

                  <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
                      {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin"/>
                      ) : (
                              "Save Settings"
                      )}
                  </Button>
              </div>

              {/* preview and embed */}
              <div className="space-y-6">
                  {/* live preview */}
                  <Card className="border-border bg-surface">
                      <CardHeader>
                          <CardTitle className="text-base">Live Preview</CardTitle>
                          <CardDescription>Real-time preview of your widget</CardDescription>
                      </CardHeader>

                      <CardContent>
                          <div className={cn(
                              "p-6 rounded-xl border",
                              localSettings.theme==="dark"?"bg-[#1a1a1a] border-[#2a2a2a]":"bg-white border-gray-200"
                          )}
                              style={{borderRadius:radiusMap[localSettings.borderRadius]} }
                          >
                              
                              <div
                                  className="p-6 border"
                                  style={{
                                      borderRadius: radiusMap[localSettings.borderRadius],
                                      borderColor: localSettings.theme === "dark" ? "#2a2a2a" : "#e5e5e5",
                                      backgroundColor: localSettings.theme === "dark" ? "#1a1a1a" : "#ffffff",
                                      fontFamily:
                                          localSettings.fontFamily === "serif"
                                              ? "Georgia,serif"
                                              : localSettings.fontFamily === "inter"
                                                  ? "Inter, sans-serif"
                                                  :"inherit"
                                  }}
                              >
                                  {localSettings.showRating && (
                                      <div className="mb-4 flex gap-1" style={{ color: localSettings.primaryColor }}>
                                          {Array.from({ length: 5 }).map((_, i) => (
                                              <Star key={i} className="h-5 w-5 fill-current"/>
                                          ))}
                                      </div>
                                  )}
                                  <p className={cn(
                                      "text-sm leading-relaxed",
                                      localSettings.theme==="dark"?"text-[#f0efe8]":"text-[#1c1c1a]"
                                  )}>
                                      Honestly didn't expect the redesign to be done this fast. Communication was clear throughout the whole project
                                  </p>

                                  <div className="mt-5 flex items-center gap-3">
                                      {localSettings.showAvatar && (
                                          <div
                                            className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
                                              style={{
                                                  backgroundColor: localSettings.theme === "dark" ? "#2a2a2a" : "#f0f0f0",
                                                  color:localSettings.theme==="dark"?"#f0efe8":"#1c1c1a"
                                            }}  
                                          >
                                              P
                                          </div>
                                      )}
                                 

                                  <div className="min-w-0">
                                      <p className={cn(
                                          "font-medium text-sm",
                                          localSettings.theme==="dark"?"text-[#f0efe8]":"text-[#1c1c1a]"
                                      )}>
                                          Priya Sharma
                                      </p>
                                      {localSettings.showCompany && (
                                          <p className="text-xs text-text-secondary">Loop Studio</p>
                                      )}
                                      {localSettings.showVerifiedBadge && (
                                          <p className="text-xs text-success mt-0.5">
                                              ✅ Verified via Speakwell
                                          </p>
                                          )}
                                           </div>
                                  </div>
                              </div>
                          </div>
                      </CardContent>
                  </Card>

                  {/* embed snippet */}
                  <Card className="border-border bg-surface">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                              <Code2 className="h-4 w-4" />
                              Embed Snippet
                          </CardTitle>
                          <CardDescription>Paste this code where you want the widget to appear.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <Select value={effectiveRequestId} onValueChange={setSelectedRequestId}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a request"/>
                              </SelectTrigger>

                              <SelectContent>
                                  {requests.map((r) => (
                                      <SelectItem key={r._id} value={r._id}>
                                          {r.title}
                                      </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                          {isLoadingSnippet ? (
                              <Skeleton className="h-24 w-full"/>
                          ) : snippet ? (
                                  <>
                                      <pre className="overflow-x-auto rounded-lg bg-card p-4 text-xs text-text-secondary border border-border">
                                          <code>{snippet}</code>
                                      </pre>
                                      
                                      <Button
                                          variant="outline"
                                          size="lg"
                                          onClick={handleCopySnippet}
                                          className="w-full"
                                      >
                                          {copied ? (
                                              <>
                                                  <Check className="mr-2 h-4 w-4" />
                                                  Copied to clipboard
                                              </>
                                          ) : (
                                              <>
                                                  <Copy className="mr-2 h-4 w-4" />
                                                  Copy Embed Code
                                              </>
                                          )}
                                            </Button>
                                  </>
                                         ) :(
                                          <p className="text-sm text-text-muted py-8 text-center">
                                              Create a testimonial request first to generate embed code.
                                          </p>
                                          )}
                                    
                    
                      </CardContent>
                  </Card>
              </div>
          </div>
    </div>
  )
}

export default WidgetSettingsPage