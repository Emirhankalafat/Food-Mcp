#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// db bağlantısı import et
import { testDatabaseConnection } from "./utils/db.js";

// Doğru .env dosyasını yükle
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Araçları içe aktar
import foodAdd from "./tools/food_add.js";
import foodList from "./tools/food_list.js";
import foodSummary from "./tools/food_summary.js";

// Başlamadan önce veritabanı bağlantısını test et
const dbReady = await testDatabaseConnection();
if (!dbReady) {
  console.error("❌ Veritabanı bağlantısı başarısız. MCP sunucusu başlatılamıyor.");
  process.exit(1);
}

// Model Context Protocol (MCP) sunucusu oluştur
const server = new Server(
  { name: "diet-tracker", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Tüm araçları bir dizide topla
const tools = [foodAdd, foodList, foodSummary];

// Araç isimlerini console'a yaz
console.error(`📝 ${tools.length} adet MCP aracı kaydedildi:`);
tools.forEach(tool => {
  console.error(`  - ${tool.name}: ${tool.description}`);
});

// Araç isimlerini anahtar olarak kullanan bir harita oluştur
const toolMap = Object.fromEntries(tools.map(t => [t.name, t]));

// İstek işleyici
server.fallbackRequestHandler = async (request) => {
  const { method, params } = request;

  if (method === "initialize") {
    console.error("🚀 İstemci bağlantısı başlatılıyor...");
    return {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "diet-tracker", version: "1.0.0" }
    };
  }

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

  if (["resources/list", "prompts/list"].includes(method)) {
    console.error(`⚠️ Bilinmeyen metod çağrısı: ${method}`);
    return {};
  }

  console.error(`⚠️ Bilinmeyen metod çağrısı: ${method}`);
  return {};
};

// STDIO ile Claude'a bağlan
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.error("✅ Diet Tracker MCP sunucusu başlatıldı");
});
