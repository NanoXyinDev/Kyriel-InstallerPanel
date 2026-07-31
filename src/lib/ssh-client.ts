'use server'

import { Client } from 'ssh2'

export interface SSHConfig {
  host: string
  port?: number
  username: string
  password: string
}

export async function testConnection(config: SSHConfig): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const conn = new Client()
    conn
      .on('ready', () => {
        conn.end()
        resolve({ success: true, message: 'SSH connection successful' })
      })
      .on('error', (err: Error) => {
        resolve({ success: false, message: err.message })
      })
      .connect({
        host: config.host,
        port: config.port || 22,
        username: config.username,
        password: config.password,
        readyTimeout: 10000,
      })
  })
}

export async function executeBackground(
  config: SSHConfig,
  command: string,
  logFile: string
): Promise<{ success: boolean; output: string; error?: string }> {
  return new Promise((resolve) => {
    const conn = new Client()
    const fullCmd = `nohup ${command} > ${logFile} 2>&1 & echo "PID:$!"`
    let output = ''

    conn
      .on('ready', () => {
        conn.exec(fullCmd, (err, stream) => {
          if (err) {
            resolve({ success: false, output: '', error: err.message })
            return
          }
          stream
            .on('close', () => {
              conn.end()
              resolve({ success: true, output: output.trim() })
            })
            .on('data', (data: Buffer) => {
              output += data.toString()
            })
            .stderr.on('data', (data: Buffer) => {
              output += data.toString()
            })
        })
      })
      .on('error', (err: Error) => {
        resolve({ success: false, output: '', error: err.message })
      })
      .connect({
        host: config.host,
        port: config.port || 22,
        username: config.username,
        password: config.password,
        readyTimeout: 15000,
      })
  })
}

export async function readFile(config: SSHConfig, remotePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn
      .on('ready', () => {
        conn.sftp((err, sftp) => {
          if (err) {
            conn.end()
            reject(new Error(err.message))
            return
          }
          let data = ''
          const stream = sftp.createReadStream(remotePath)
          stream
            .on('data', (chunk: Buffer) => {
              data += chunk.toString()
            })
            .on('end', () => {
              conn.end()
              resolve(data)
            })
            .on('error', (err: Error) => {
              conn.end()
              reject(err)
            })
        })
      })
      .on('error', (err: Error) => {
        reject(err)
      })
      .connect({
        host: config.host,
        port: config.port || 22,
        username: config.username,
        password: config.password,
        readyTimeout: 10000,
      })
  })
}
