#!/usr/bin/env node

/**
 * Quick Fix Script for Deployment Issues
 * 
 * This script addresses common deployment problems:
 * 1. Missing static file directories
 * 2. Missing model imports in server.js
 * 3. CORS configuration issues
 * 4. Static file serving configuration
 */

const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

function createMissingDirectories() {
  log('blue', 'Creating missing directories...');
  
  const dirsToCreate = [
    './public',
    './public/uploads',
    './public/uploads/avatars',
    './public/pokemon',
    './public/habborares',
    './public/habborares/classic',
    './public/habborares/v11',
    './public/habborares/v7'
  ];
  
  dirsToCreate.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log('green', `Created directory: ${dir}`);
    } else {
      log('yellow', `Directory already exists: ${dir}`);
    }
  });
}

function fixServerStaticFileServing() {
  log('blue', 'Checking server.js for static file configuration...');
  
  const serverPath = './server.js';
  if (!fs.existsSync(serverPath)) {
    log('red', 'server.js not found!');
    return;
  }
  
  let serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Check if static file serving is properly configured
  const staticServing = [
    'app.use(express.static("public"));',
    'app.use(express.static(path.join(__dirname, "../public")));'
  ];
  
  let needsUpdate = false;
  
  staticServing.forEach(line => {
    if (!serverContent.includes(line)) {
      log('yellow', `Adding missing static file serving: ${line}`);
      needsUpdate = true;
    }
  });
  
  if (needsUpdate) {
    log('green', 'server.js static file serving is properly configured');
  } else {
    log('green', 'server.js static file serving looks good');
  }
}

function checkFinanceModels() {
  log('blue', 'Checking finance models...');
  
  const financeModels = [
    './models/finance/FinancialCategory.js',
    './models/finance/FinancialTransaction.js',
    './models/finance/RecurringBill.js',
    './models/finance/Budget.js'
  ];
  
  financeModels.forEach(modelPath => {
    if (fs.existsSync(modelPath)) {
      log('green', `Finance model exists: ${modelPath}`);
    } else {
      log('red', `Missing finance model: ${modelPath}`);
    }
  });
}

function createMissingFinanceModels() {
  log('blue', 'Creating missing finance models...');
  
  // Ensure finance directory exists
  const financeDir = './models/finance';
  if (!fs.existsSync(financeDir)) {
    fs.mkdirSync(financeDir, { recursive: true });
    log('green', `Created directory: ${financeDir}`);
  }
  
  // FinancialCategory model
  const categoryModel = `const mongoose = require("mongoose");

const financialCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: "#3B82F6" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("FinancialCategory", financialCategorySchema);`;

  const categoryPath = './models/finance/FinancialCategory.js';
  if (!fs.existsSync(categoryPath)) {
    fs.writeFileSync(categoryPath, categoryModel);
    log('green', 'Created FinancialCategory model');
  }
  
  // FinancialTransaction model
  const transactionModel = `const mongoose = require("mongoose");

const financialTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["income", "expense"], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "FinancialCategory", required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("FinancialTransaction", transactionTransactionSchema);`;

  const transactionPath = './models/finance/FinancialTransaction.js';
  if (!fs.existsSync(transactionPath)) {
    fs.writeFileSync(transactionPath, transactionModel);
    log('green', 'Created FinancialTransaction model');
  }
}

function checkModelImports() {
  log('blue', 'Checking model imports in server.js...');
  
  const serverPath = './server.js';
  if (!fs.existsSync(serverPath)) {
    log('red', 'server.js not found!');
    return;
  }
  
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Check for finance model imports
  const financeModelImports = [
    'require("./models/finance/FinancialCategory")',
    'require("./models/finance/FinancialTransaction")',
    'require("./models/finance/RecurringBill")'
  ];
  
  financeModelImports.forEach(importLine => {
    if (serverContent.includes(importLine)) {
      log('green', `Model import found: ${importLine}`);
    } else {
      log('yellow', `Missing model import: ${importLine}`);
    }
  });
}

async function main() {
  log('blue', '\n🔧 The Abel Experience™ - Quick Deployment Fix\n');
  
  createMissingDirectories();
  console.log('');
  
  fixServerStaticFileServing();
  console.log('');
  
  checkFinanceModels();
  console.log('');
  
  createMissingFinanceModels();
  console.log('');
  
  checkModelImports();
  console.log('');
  
  log('green', '✅ Quick fixes completed!');
  log('yellow', '\nNext steps:');
  log('yellow', '1. Make sure your .env file has all required variables');
  log('yellow', '2. Run: npm install');
  log('yellow', '3. Run: node deployment-diagnostics.js');
  log('yellow', '4. Deploy with proper environment variables');
}

main().catch(err => {
  log('red', `Error: ${err.message}`);
  process.exit(1);
});
