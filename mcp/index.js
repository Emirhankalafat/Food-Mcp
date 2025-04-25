#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';

// Araçları içe aktar
import foodAdd from "./tools/food_add.js";
import foodList from "./tools/food_list.js";
import foodSummary from "./tools/food_summary.js";

// Çevre değişkenlerini yükle
dotenv.config();

// Kullanıcının API anahtarını çevre değişkenlerinden al
// Claude Desktop tarafından sağlanır
process.env.API_KEY = process.env.API_KEY

// Model Context Protocol (MCP) sunucusu oluştur
const server = new Server(
  { name: "diet-tracker", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Tüm araçları bir dizide topla
const tools = [foodAdd, foodList, foodSummary];

// Kayıtlı tool'ları console'a yaz
console.error(`📝 ${tools.length} adet MCP aracı kaydedildi:`);
tools.forEach(tool => {
  console.error(`  - ${tool.name}: ${tool.description}`);
});

// Araç isimlerini anahtar olarak kullanan bir harita oluştur
const toolMap = Object.fromEntries(tools.map(t => [t.name, t]));

// İstek işleyici
server.fallbackRequestHandler = async (request) => {
  const { method, params } = request;
  
  // MCP protokolü başlatma isteği
  if (method === "initialize") {
    console.error("🚀 İstemci bağlantısı başlatılıyor...");
    return {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "diet-tracker", version: "1.0.0" }
    };
  }
  
  // Araçları listeleme isteği
  if (method === "tools/list") {
    console.error("📋 Araçlar listeleniyor");
    return {
      tools: tools.map(({ name, description, inputSchema }) => ({
        name,
        description,
        inputSchema
      }))
    };
  }
  
  // Araç çağırma isteği
  if (method === "tools/call") {
    const { name, arguments: args = {} } = params;
    console.error(`🔧 "${name}" aracı çalıştırılıyor, girdiler:`, args);
    
    const tool = toolMap[name];
    if (!tool) {
      console.error(`❌ Tool bulunamadı: ${name}`);
      return {
        error: {
          code: -32601,
          message: `Tool bulunamadı: ${name}`
        }
      };
    }
    
    try {
      // Aracı çağır ve sonucu döndür
      const result = await tool.handler(args);
      console.error(`✅ "${name}" aracı başarıyla çalıştırıldı`);
      return result;
    } catch (error) {
      console.error(`❌ ${name} aracı çalıştırılırken hata:`, error);
      return {
        error: {
          code: -32000,
          message: "Tool çalıştırılırken hata oluştu",
          data: error.message
        }
      };
    }
  }
  
  // Diğer MCP protokolü istekleri
  if (method === "resources/list" || method === "prompts/list") {
    console.error(`⚠️ Bilinmeyen metod çağrısı: ${method}`);
    return {};
  }
  
  // Bilinmeyen metodlar için boş yanıt döndür
  console.error(`⚠️ Bilinmeyen metod çağrısı: ${method}`);
  return {};
};

// STDIO ile Claude'a bağlan
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error("✅ Diet Tracker MCP sunucusu başlatıldı");
});