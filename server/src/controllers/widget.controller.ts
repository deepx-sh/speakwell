import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { env } from "../config/env";

import { getWidgetDataService, getWidgetSettingsService, updateWidgetSettingsService, getEmbedScriptService } from "../services/widget.service";


export const getWidgetDataController = asyncHandler(
    async (req: Request, res: Response) => {
        const { token } = req.params;
        
        if (typeof token !== "string") {
            throw new Error("Invalid token ID")
        }
        const data = await getWidgetDataService(token);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Widget data fetched successfully",
                data
            })
        )
    }
)

export const serveEmbedScriptController = asyncHandler(
    async (req: Request, res: Response) => {
        
        const tokenParam = req.params.token;

        if (typeof tokenParam !== "string") {
            throw new Error("Invalid token")
        }

        const token = tokenParam.replace(".js", "");

        await getWidgetDataService(token);

        const apiBase = env.SERVER_URL;

        const script = `
        (function(){
            let token="${token}";
            let apiBase="${apiBase}";

            function fetchAndRender(){
                fetch(apiBase+"/api/widget/"+token)
                .then(function(res){return res.json()})
                .then(function(json){
                    if(!json.success) return;
                    let data=json.data;
                    let settings=data.settings;
                    let testimonials=data.testimonials;

                    if(!testimonials || testimonials.length===0) return;

                    let container=document.createElement("div");
                    container.style.cssText=[
                        "display:flex",
                        "flex-wrap:wrap",
                        "gap:16px",
                        "font-family:"+(settings.fontFamily==="inherit" ? "inherit" : settings.fontFamily+",sans-serif")
                    ].join(";");

                    testimonials.forEach(function(t){
                        let card=document.createElement("div");
                        card.style.cssText=[
                            "background:"+(settings.theme==="dark" ? "#1a1a1a" : "#ffffff"),
                            "color:"+(settings.theme==="dark" ? "#f0efe8":"#1c1c1a"),
                            "border:1px solid "+ (settings.theme==="dark" ? "#2a2a2a": "#e5e5e5"),
                            "border-radius:"+ getBorderRadius(settings.borderRadius),
                            "padding:20px 24px",
                            "max-width:420px",
                            "flex:1 1 280px",
                        ].join(";")

                        let html="";

                        if(settings.showRating && t.rating){
                            html+="<div style='color:"+ settings.primaryColor + ";font-size:18px;margin-bottom:10px'>"
                            +"★".repeat(t.rating)+"☆".repeat(5-t.rating)
                            +"</div>";
                        }

                        html+="<p style='margin:0 0 16px;font-size:15px;line-height:1.7'>"
                            + escapeHtml(t.approvedTestimonial)
                            +"</p>";

                        html+="<div style='display:flex;align-items:center;gap:10px'>";

                        if(settings.showAvatar && t.clientAvatar){
                        html+="<img src='"+t.clientAvatar+ "' style='width:36px;height:36px;border-radius:50%;object-fit:cover'/>";
                            }

                        html+="<div>";
                        html+="<p style='margin:0;font-weight:500;font-size:14px'>"+escapeHtml(t.clientName)+"</p>";

                        if(settings.showCompany && t.clientCompany){
                            html+="<p style='margin:2px 0 0;font-size:12px;opacity:0.6'>"+escapeHtml(t.clientCompany)+"</p>";
                        }

                        if(settings.showVerifiedBadge){
                            html+="<p style='margin:4px 0 0;font-size:11px;color:#3b6b4a'>✅ Verified via Speakwell</p>";
                        }

                        html+="</div></div>";

                        card.innerHTML=html;
                        container.appendChild(card);
                    })

                    let scripts=document.querySelectorAll("script[src*='"+ token+"']");
                    let scriptTag=scripts[scripts.length-1];

                    if(scriptTag && scriptTag.parentNode){
                        scriptTag.parentNode.insertBefore(container,scriptTag);
                    }
    }).catch(function(err){
        console.warn("Speakwell widget error:",err);
    })
            }

            function getBorderRadius(val){
                let map={none:"0px", small:"4px",medium:"8px",large:"16px"};
                return map[val] || "8px"
            }

            function escapeHtml(str){
                if(!str) return "";

                return str
                        .replace(/&/g,"&amp;")
                        .replace(/</g,"&lt;")
                        .replace(/>/g,"&gt;")
                        .replace(/"/g,"&quot;");

            }

            if(document.readyState==="loading"){
                document.addEventListener("DOMContentLoaded",fetchAndRender);
            }else{
                fetchAndRender();
                }
        })();
        `.trim();

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=300"); 
        res.setHeader("X-Content-Type-Options", "nosniff");

        return res.send(script);
    }
)


export const getWidgetSettingsController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();

        const settings = await getWidgetSettingsService(ownerId);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Widget settings fetched successfully",
                data:settings
            })
        )
    }
)

export const updateWidgetSettingsController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();

        const settings = await updateWidgetSettingsService(ownerId, req.body);

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Widget settings updated successfully",
                data:settings,
            })
        )
    }
)

export const getEmbedSnippetController = asyncHandler(
    async (req: Request, res: Response) => {
        const ownerId = req.user._id.toString();

        const { token } = req.params;
        
        if (typeof token !== "string") {
            throw new Error("Invalid token ID")
        }
        await getEmbedScriptService(token, ownerId);

        const snippet = `<script src="${env.SERVER_URL}/api/widget/embed/${token}.js"></script>`;

        return res.status(200).json(
            apiResponse({
                success: true,
                message: "Embed snippet generated",
                data:{snippet}
            })
        )
    }
)